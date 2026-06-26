import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";
import type { ClubParticipantsResponseResult } from "@/types/groups/grouphome";

export const clubhomeKeys = {
  all: (clubId: number) => ["clubhome", clubId] as const,
  me: (clubId: number) => [...clubhomeKeys.all(clubId), "me"] as const,
  home: (clubId: number) => [...clubhomeKeys.all(clubId), "home"] as const,
  latestNotice: (clubId: number) => [...clubhomeKeys.all(clubId), "latestNotice"] as const,
  nextMeeting: (clubId: number) => [...clubhomeKeys.all(clubId), "nextMeeting"] as const,
  participants: (clubId: number) => [...clubhomeKeys.all(clubId), "participants"] as const,
};

export function useClubhomeQueries(clubId: number) {
  const enabled = Number.isFinite(clubId) && clubId > 0;

  const meQuery = useQuery({
    queryKey: clubhomeKeys.me(clubId),
    queryFn: () => clubService.getMyStatus(clubId),
    enabled,
  });

  const homeQuery = useQuery({
    queryKey: clubhomeKeys.home(clubId),
    queryFn: () => clubService.getClubHome(clubId),
    enabled,
  });

  const latestNoticeQuery = useQuery({
    queryKey: clubhomeKeys.latestNotice(clubId),
    queryFn: () => clubService.getLatestNotice(clubId),
    enabled,
    retry: false,
  });

  const nextMeetingQuery = useQuery({
    queryKey: clubhomeKeys.nextMeeting(clubId),
    queryFn: () => clubService.getNextMeeting(clubId),
    enabled,
    retry: false,
  });

  return {
    meQuery,
    homeQuery,
    latestNoticeQuery,
    nextMeetingQuery,
  };
}

export function useClubMeQuery(clubId: number) {
  const enabled = Number.isFinite(clubId) && clubId > 0;

  return useQuery({
    queryKey: clubhomeKeys.me(clubId),
    queryFn: () => clubService.getMyStatus(clubId),
    enabled,
  });
}

export function useClubParticipantsInfiniteQuery(clubId: number, enabled = true) {
  const canFetch = enabled && Number.isFinite(clubId) && clubId > 0;

  return useInfiniteQuery<
    ClubParticipantsResponseResult,
    Error,
    InfiniteData<ClubParticipantsResponseResult, number | null>,
    ReturnType<typeof clubhomeKeys.participants>,
    number | null
  >({
    queryKey: clubhomeKeys.participants(clubId),
    enabled: canFetch,
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      clubService.getClubParticipants({
        clubId,
        cursorId: pageParam ?? null,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
    retry: false,
  });
}
