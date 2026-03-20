import { useInfiniteQuery } from "@tanstack/react-query";
import { clubNotificationService } from "@/services/clubNotificationService";
import type { GetClubNoticeCommentsResponseResult } from "@/types/clubnotification";
import { clubNoticeQueryKeys } from "./useClubNotificationQueries";

export function useClubNoticeCommentsInfiniteQuery(
  clubId: number,
  noticeId: number,
  options?: { enabled?: boolean }
) {
  const enabled =
    (options?.enabled ?? true) &&
    Number.isFinite(clubId) &&
    Number.isFinite(noticeId);

  return useInfiniteQuery({
    queryKey: clubNoticeQueryKeys.comments(clubId, noticeId),
    enabled,
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) =>
      clubNotificationService.getNoticeComments({
        clubId,
        noticeId,
        cursorId: (pageParam as number | null) ?? null,
      }),
    getNextPageParam: (lastPage: GetClubNoticeCommentsResponseResult) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}