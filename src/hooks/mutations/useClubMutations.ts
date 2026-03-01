"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";
import { clubKeys } from "@/hooks/queries/useClubQueries";
import toast from "react-hot-toast";

export function useLeaveClubMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clubId: number) => clubService.leaveClub(clubId),
        onSuccess: () => {
            toast.success("모임에서 탈퇴했습니다.");
            queryClient.invalidateQueries({ queryKey: clubKeys.myList() });
        },
        onError: (error: any) => {
            const message = error?.message || "탈퇴 처리 중 오류가 발생했습니다.";
            toast.error(message);
        },
    });
}
