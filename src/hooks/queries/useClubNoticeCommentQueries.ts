import { useInfiniteQuery } from "@tanstack/react-query";
import { clubNotificationService } from "@/services/clubNotificationService";
import { GetClubNoticeCommentsResponseResult } from "@/types/clubnotification";
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

  return useInfiniteQuery<
    GetClubNoticeCommentsResponseResult,
    Error,
    GetClubNoticeCommentsResponseResult,
    ReturnType<typeof clubNoticeQueryKeys.comments>,
    number | null
  >({
    queryKey: clubNoticeQueryKeys.comments(clubId, noticeId),
    enabled,
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      clubNotificationService.getNoticeComments({
        clubId,
        noticeId,
        cursorId: pageParam ?? null,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}