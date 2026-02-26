"use client";

// src/hooks/mutations/useClubMemberMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubMemberService } from "@/services/clubMemberService";
import { clubMemberQueryKeys } from "@/hooks/queries/useClubMemberQueries";
import type { UpdateClubMemberStatusRequest } from "@/types/groups/clubMembers";

type Variables = {
  clubId: number;
  clubMemberId: number;
  body: UpdateClubMemberStatusRequest;
};

export function useUpdateClubMemberStatusMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, clubMemberId, body }: Variables) =>
      clubMemberService.updateClubMemberStatus(clubId, clubMemberId, body),

    onSuccess: async (_data, variables) => {
      // 가입 신청 관리 페이지는 PENDING만 보면 되니까 이거 하나만 갱신해도 충분
      await qc.invalidateQueries({
        queryKey: clubMemberQueryKeys.members(variables.clubId, "PENDING"),
      });
    },
  });
}