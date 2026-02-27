import { useQuery } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";

export const memberKeys = {
    all: ["members"] as const,
    recommended: () => [...memberKeys.all, "recommended"] as const,
    profile: () => [...memberKeys.all, "profile"] as const,
    otherProfile: (nickname: string) => [...memberKeys.all, "profile", nickname] as const,
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
