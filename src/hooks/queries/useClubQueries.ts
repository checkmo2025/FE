import { useQuery } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";

export const clubKeys = {
    all: ["clubs"] as const,
    myList: () => [...clubKeys.all, "myList"] as const,
    memberList: (nickname: string) => [...clubKeys.all, "memberList", nickname] as const,
};

export const useMyClubsQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: clubKeys.myList(),
        queryFn: () => clubService.getMyClubs(),
        enabled,
    });
};

export const useMemberClubsQuery = (nickname: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: clubKeys.memberList(nickname),
        queryFn: () => clubService.getMemberClubs(nickname),
        enabled: enabled && !!nickname,
    });
};
