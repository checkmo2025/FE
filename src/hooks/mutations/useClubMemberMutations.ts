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
      // 가입 신청 관리(PENDING)와 전체 회원 관리(ALL) 페이지 쿼리를 모두 무효화합니다.
      await Promise.all([
        qc.invalidateQueries({
          queryKey: clubMemberQueryKeys.members(variables.clubId, "PENDING"),
        }),
        qc.invalidateQueries({
          queryKey: clubMemberQueryKeys.members(variables.clubId, "ALL"),
        }),
      ]);
    },
  });
}
