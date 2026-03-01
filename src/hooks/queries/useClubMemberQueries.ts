"use client";

// src/hooks/queries/useClubMemberQueries.ts
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { clubMemberService } from "@/services/clubMemberService";
import type { ClubMemberListStatusFilter, GetClubMembersResult } from "@/types/groups/clubMembers";

export const clubMemberQueryKeys = {
  members: (clubId: number, status: ClubMemberListStatusFilter) =>
    ["clubs", clubId, "members", status] as const,
};

export function useInfiniteClubMembersQuery(
  clubId: number,
  status: ClubMemberListStatusFilter,
  enabled: boolean
) {
  return useInfiniteQuery<
    GetClubMembersResult,
    Error,
    InfiniteData<GetClubMembersResult>,
    ReturnType<typeof clubMemberQueryKeys.members>,
    number | undefined
  >({
    queryKey: clubMemberQueryKeys.members(clubId, status),
    enabled,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      clubMemberService.getClubMembers({
        clubId,
        status,
        cursorId: pageParam ?? null,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}