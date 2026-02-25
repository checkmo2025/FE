import { useQuery } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";

export const memberKeys = {
    all: ["members"] as const,
    recommended: () => [...memberKeys.all, "recommended"] as const,
};

export const useRecommendedMembersQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: memberKeys.recommended(),
        queryFn: () => memberService.getRecommendedMembers(),
        enabled,
    });
};
