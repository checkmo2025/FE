import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { memberService } from "@/services/memberService";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { ReportMemberRequest } from "@/types/member";
import { memberKeys } from "../queries/useMemberQueries";

interface UpdateProfilePayload {
    description: string;
    categories: string[];
    phoneNumber: string;
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
                phoneNumber: payload.phoneNumber,
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

import { UpdatePasswordRequest, RecommendResponse, FollowListResponse, FindEmailRequest, OtherProfileResponse, FollowCountResponse } from "@/types/member";
import { BookStoryListResponse } from "@/types/story";
import { storyKeys } from "@/hooks/queries/useStoryQueries";
import { InfiniteData } from "@tanstack/react-query";

// Optimistic update helpers
const updateFollowStateInRecommend = (old: RecommendResponse | undefined, nickname: string, isFollowing: boolean) => {
    if (!old || !old.friends) return old;
    return {
        ...old,
        friends: old.friends.map((member) =>
            member.nickname === nickname
                ? { ...member, isFollowing: !isFollowing }
                : member
        )
    };
};

const updateFollowStateInInfiniteList = (old: InfiniteData<BookStoryListResponse> | undefined, nickname: string, isFollowing: boolean) => {
    if (!old || !old.pages) return old;
    return {
        ...old,
        pages: old.pages.map((page) => ({
            ...page,
            basicInfoList: page.basicInfoList.map((story) =>
                story.authorInfo.nickname === nickname
                    ? { ...story, authorInfo: { ...story.authorInfo, following: !isFollowing } }
                    : story
            )
        }))
    };
};

const updateFollowStateInList = (old: BookStoryListResponse | undefined, nickname: string, isFollowing: boolean) => {
    if (!old || !old.basicInfoList) return old;
    return {
        ...old,
        basicInfoList: old.basicInfoList.map((story) =>
            story.authorInfo.nickname === nickname
                ? { ...story, authorInfo: { ...story.authorInfo, following: !isFollowing } }
                : story
        )
    };
};

const updateFollowStateInFollowList = (old: InfiniteData<FollowListResponse> | undefined, nickname: string, isFollowing: boolean) => {
    if (!old || !old.pages) return old;
    return {
        ...old,
        pages: old.pages.map((page) => ({
            ...page,
            followList: page.followList.map((member) =>
                member.nickname === nickname
                    ? { ...member, following: !isFollowing }
                    : member
            )
        }))
    };
};

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

export const useUpdateEmailMutation = () => {
    return useMutation({
        mutationFn: async (payload: import("@/types/member").UpdateEmailRequest) => {
            await memberService.updateEmail(payload);
        },
        onSuccess: () => {
            toast.success("이메일이 성공적으로 변경되었습니다.");
        },
        onError: (error: any) => {
            console.error("Failed to update email:", error);
            const errorMessage = error.response?.data?.message || error.message || "이메일 변경에 실패했습니다.";
            toast.error(errorMessage);
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
            await queryClient.cancelQueries({ queryKey: memberKeys.otherProfile(nickname) });
            await queryClient.cancelQueries({ queryKey: memberKeys.followers() });
            await queryClient.cancelQueries({ queryKey: memberKeys.followings() });
            await queryClient.cancelQueries({ queryKey: memberKeys.followCount() });

            // Snapshot previous values
            const previousRecommendations = queryClient.getQueryData(memberKeys.recommended());
            const previousInfiniteStories = queryClient.getQueryData(storyKeys.infiniteList());
            const previousStories = queryClient.getQueryData(storyKeys.list());
            const previousOtherProfile = queryClient.getQueryData(memberKeys.otherProfile(nickname));
            const previousFollowers = queryClient.getQueryData(memberKeys.followers());
            const previousFollowings = queryClient.getQueryData(memberKeys.followings());
            const previousFollowCount = queryClient.getQueryData<FollowCountResponse>(memberKeys.followCount());

            // 1. Optimistically update recommendations
            if (previousRecommendations) {
                queryClient.setQueryData<RecommendResponse>(memberKeys.recommended(), (old) =>
                    updateFollowStateInRecommend(old, nickname, isFollowing)
                );
            }

            // 2. Optimistically update infinite stories
            if (previousInfiniteStories) {
                queryClient.setQueryData<InfiniteData<BookStoryListResponse>>(storyKeys.infiniteList(), (old) =>
                    updateFollowStateInInfiniteList(old, nickname, isFollowing)
                );
            }

            // 3. Optimistically update stories list
            if (previousStories) {
                queryClient.setQueryData<BookStoryListResponse>(storyKeys.list(), (old) =>
                    updateFollowStateInList(old, nickname, isFollowing)
                );
            }

            // 4. Optimistically update other profile
            if (previousOtherProfile) {
                queryClient.setQueryData<OtherProfileResponse>(memberKeys.otherProfile(nickname), (old) => {
                    if (!old) return old;
                    const newFollowing = !isFollowing;
                    return {
                        ...old,
                        following: newFollowing,
                        followerCount: newFollowing ? old.followerCount + 1 : Math.max(0, old.followerCount - 1)
                    };
                });
            }

            // 5. Optimistically update followers/followings list
            if (previousFollowers) {
                queryClient.setQueryData<InfiniteData<FollowListResponse>>(memberKeys.followers(), (old) =>
                    updateFollowStateInFollowList(old, nickname, isFollowing)
                );
            }
            if (previousFollowings) {
                queryClient.setQueryData<InfiniteData<FollowListResponse>>(memberKeys.followings(), (old) =>
                    updateFollowStateInFollowList(old, nickname, isFollowing)
                );
            }

            // 6. Optimistically update follow count (only "following" count since it's "me" following someone else)
            if (previousFollowCount) {
                queryClient.setQueryData<FollowCountResponse>(memberKeys.followCount(), (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        followingCount: isFollowing ? Math.max(0, old.followingCount - 1) : old.followingCount + 1
                    };
                });
            }

            return { previousRecommendations, previousInfiniteStories, previousStories, previousOtherProfile, previousFollowers, previousFollowings, previousFollowCount };
        },
        onSuccess: (_data, { isFollowing }) => {
            if (isFollowing) {
                toast.success("구독이 취소되었습니다.");
            } else {
                toast.success("구독이 완료되었습니다.");
            }
        },
        onError: (error: any, variables, context) => {
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
            if (context?.previousOtherProfile) {
                queryClient.setQueryData(memberKeys.otherProfile(variables.nickname), context.previousOtherProfile);
            }
            if (context?.previousFollowers) {
                queryClient.setQueryData(memberKeys.followers(), context.previousFollowers);
            }
            if (context?.previousFollowings) {
                queryClient.setQueryData(memberKeys.followings(), context.previousFollowings);
            }
            if (context?.previousFollowCount) {
                queryClient.setQueryData(memberKeys.followCount(), context.previousFollowCount);
            }
        },
        onSettled: (_data, _error, variables) => {
            // Refetch to sync with server
            queryClient.invalidateQueries({ queryKey: storyKeys.all });
            queryClient.invalidateQueries({ queryKey: memberKeys.recommended() });
            queryClient.invalidateQueries({ queryKey: memberKeys.otherProfile(variables.nickname) });
            queryClient.invalidateQueries({ queryKey: memberKeys.followers(), refetchType: 'none' });
            queryClient.invalidateQueries({ queryKey: memberKeys.followings(), refetchType: 'none' });
            queryClient.invalidateQueries({ queryKey: memberKeys.followCount() });
        },
    });
};

export const useDeleteFollowerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nickname: string) => {
            await memberService.deleteFollower(nickname);
        },
        onSuccess: () => {
            toast.success("구독자가 삭제되었습니다.");
            // Mark the follower list as stale, but don't refetch immediately.
            // This ensures that deleted items are only removed when the user navigates
            // away and back to the tab.
            queryClient.invalidateQueries({
                queryKey: memberKeys.followers(),
                refetchType: "none",
            });
        },
        onError: (error: any) => {
            console.error("Failed to delete follower:", error);
            const errorMessage = error.response?.data?.message || error.message || "구독자 삭제에 실패했습니다.";
            toast.error(errorMessage);
        },
    });
};

export const useReportMemberMutation = () => {
    return useMutation({
        mutationFn: async (payload: ReportMemberRequest) => {
            await memberService.reportMember(payload);
        },
        onSuccess: () => {
            toast.success("신고가 완료되었습니다.");
        },
        onError: (error: any) => {
            console.error("Failed to report member:", error);
            const errorMessage = error.response?.data?.message || error.message || "신고에 실패했습니다.";
            toast.error(errorMessage);
        },
    });
};

export const useFindEmailMutation = () => {
    return useMutation({
        mutationFn: async (payload: FindEmailRequest) => {
            return await memberService.findEmail(payload);
        },
        onError: (error: any) => {
            console.error("Failed to find email:", error);
            const errorMessage = error.response?.data?.message || error.message || "해당 회원을 찾을 수 없습니다.";
            toast.error(errorMessage);
        },
    });
};

export const useWithdrawMutation = () => {
    const { logout } = useAuthStore();
    return useMutation({
        mutationFn: async () => {
            await memberService.withdraw();
        },
        onSuccess: () => {
            toast.success("회원 탈퇴가 완료되었습니다.");
            logout(); // Clear auth state
            window.location.href = "/"; // Redirect to home page mapping
        },
        onError: (error: any) => {
            console.error("Failed to withdraw:", error);
            const errorMessage = error.response?.data?.message || error.message || "회원 탈퇴에 실패했습니다.";
            toast.error(errorMessage);
        },
    });
};
