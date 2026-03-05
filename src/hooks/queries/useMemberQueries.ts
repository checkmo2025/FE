import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";

export const memberKeys = {
    all: ["members"] as const,
    recommended: () => [...memberKeys.all, "recommended"] as const,
    profile: () => [...memberKeys.all, "profile"] as const,
    otherProfile: (nickname: string) => [...memberKeys.all, "profile", nickname] as const,
    followers: () => [...memberKeys.all, "followers"] as const,
    followings: () => [...memberKeys.all, "followings"] as const,
    followCount: () => [...memberKeys.all, "follow-count"] as const,
};

export const useRecommendedMembersQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: memberKeys.recommended(),
        queryFn: () => memberService.getRecommendedMembers(),
        enabled,
    });
};

export const useProfileQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: memberKeys.profile(),
        queryFn: () => memberService.getProfile(),
        enabled,
    });
};

export const useOtherProfileQuery = (nickname: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: memberKeys.otherProfile(nickname),
        queryFn: () => memberService.getOtherProfile(nickname),
        enabled: enabled && !!nickname,
    });
};

export const useFollowerListQuery = (nickname?: string, enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: nickname ? [...memberKeys.followers(), nickname] : memberKeys.followers(),
        queryFn: ({ pageParam }) => memberService.getFollowerList(nickname, pageParam),
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
        enabled,
    });
};

export const useFollowingListQuery = (nickname?: string, enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: nickname ? [...memberKeys.followings(), nickname] : memberKeys.followings(),
        queryFn: ({ pageParam }) => memberService.getFollowingList(nickname, pageParam),
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
        enabled,
    });
};

export const useFollowCountQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: memberKeys.followCount(),
        queryFn: () => memberService.getMyFollowCount(),
        enabled,
    });
};
