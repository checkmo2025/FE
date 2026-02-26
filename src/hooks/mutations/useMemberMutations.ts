import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

interface UpdateProfilePayload {
    description: string;
    categories: string[];
    profileImageFile: File | null;
    currentProfileImageUrl: string | null;
}

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            let imgUrl = payload.currentProfileImageUrl || undefined;

            // 1. Image Upload (If file is selected)
            if (payload.profileImageFile) {
                // Assume default mime if not present
                const contentType = payload.profileImageFile.type || "image/jpeg";
                // Get Pre-signed URL
                const presignedRes = await authService.getPresignedUrl("PROFILE", payload.profileImageFile.name, contentType);

                // Upload to S3
                await authService.uploadToS3(presignedRes.result!.presignedUrl, payload.profileImageFile);

                // Use the returned image URL for update
                imgUrl = presignedRes.result!.imageUrl;
            } else if (payload.currentProfileImageUrl && payload.currentProfileImageUrl.startsWith("blob:")) {
                // In case blob URL leaked without file, though shouldn't happen, clear it
                imgUrl = undefined;
            }

            // 2. Update Profile Information
            await memberService.updateProfile({
                description: payload.description,
                categories: payload.categories,
                imgUrl: imgUrl || "", // Backend might expect empty string for default
            });
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["member", "me"] });
            // Fetch the updated profile and sync it to the global auth store so the Header updates
            const response = await authService.getProfile();
            if (response.isSuccess && response.result) {
                useAuthStore.getState().login({
                    ...response.result,
                    email: response.result.email || "",
                });
            }
        },
        onError: (error: any) => {
            console.error("Failed to update profile:", error);
        },
    });
};

import { UpdatePasswordRequest } from "@/types/member";
import { storyKeys } from "@/hooks/queries/useStoryQueries";
import { memberKeys } from "@/hooks/queries/useMemberQueries";
import { toast } from "react-hot-toast";

// Throttle map to prevent spam clicking (per nickname)
const followThrottleMap: Record<string, number> = {};

export const useUpdatePasswordMutation = () => {
    return useMutation({
        mutationFn: async (payload: UpdatePasswordRequest) => {
            await memberService.updatePassword(payload);
        },
        onError: (error: any) => {
            console.error("Failed to update password:", error);
        },
    });
};

export const useToggleFollowMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ nickname, isFollowing }: { nickname: string; isFollowing: boolean }) => {
            const now = Date.now();
            const lastTime = followThrottleMap[nickname] || 0;

            // Throttle: 500ms
            if (now - lastTime < 500) {
                return; // Ignore rapid clicks
            }
            followThrottleMap[nickname] = now;

            if (isFollowing) {
                await memberService.unfollowMember(nickname);
            } else {
                await memberService.followMember(nickname);
            }
        },
        onMutate: async ({ nickname, isFollowing }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: storyKeys.all });
            await queryClient.cancelQueries({ queryKey: memberKeys.recommended() });

            // Snapshot previous values
            const previousRecommendations = queryClient.getQueryData(memberKeys.recommended());
            const previousInfiniteStories = queryClient.getQueryData(storyKeys.infiniteList());
            const previousStories = queryClient.getQueryData(storyKeys.list());

            // 1. Optimistically update recommendations
            if (previousRecommendations) {
                queryClient.setQueryData(memberKeys.recommended(), (old: any) => {
                    if (!old || !old.friends) return old;
                    return {
                        ...old,
                        friends: old.friends.map((member: any) =>
                            member.nickname === nickname
                                ? { ...member, isFollowing: !isFollowing }
                                : member
                        )
                    };
                });
            }

            // 2. Optimistically update infinite stories
            if (previousInfiniteStories) {
                queryClient.setQueryData(storyKeys.infiniteList(), (old: any) => {
                    if (!old || !old.pages) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            basicInfoList: page.basicInfoList.map((story: any) =>
                                story.authorInfo.nickname === nickname
                                    ? { ...story, authorInfo: { ...story.authorInfo, following: !isFollowing } }
                                    : story
                            )
                        }))
                    };
                });
            }

            // 3. Optimistically update stories list
            if (previousStories) {
                queryClient.setQueryData(storyKeys.list(), (old: any) => {
                    if (!old || !old.basicInfoList) return old;
                    return {
                        ...old,
                        basicInfoList: old.basicInfoList.map((story: any) =>
                            story.authorInfo.nickname === nickname
                                ? { ...story, authorInfo: { ...story.authorInfo, following: !isFollowing } }
                                : story
                        )
                    };
                });
            }

            return { previousRecommendations, previousInfiniteStories, previousStories };
        },
        onError: (error: any, _variables, context) => {
            console.error("Failed to toggle follow:", error);
            toast.error("팔로우 상태 업데이트에 실패했습니다.");

            // Rollback
            if (context?.previousRecommendations) {
                queryClient.setQueryData(memberKeys.recommended(), context.previousRecommendations);
            }
            if (context?.previousInfiniteStories) {
                queryClient.setQueryData(storyKeys.infiniteList(), context.previousInfiniteStories);
            }
            if (context?.previousStories) {
                queryClient.setQueryData(storyKeys.list(), context.previousStories);
            }
        },
        onSettled: () => {
            // Refetch to sync with server
            queryClient.invalidateQueries({ queryKey: storyKeys.all });
            queryClient.invalidateQueries({ queryKey: memberKeys.recommended() });
        },
    });
};
