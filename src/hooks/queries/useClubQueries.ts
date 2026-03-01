import { useQuery } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";

export const clubKeys = {
    all: ["clubs"] as const,
    myList: () => [...clubKeys.all, "myList"] as const,
};

export const useMyClubsQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: clubKeys.myList(),
        queryFn: () => clubService.getMyClubs(),
        enabled,
    });
};
