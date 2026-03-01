import { useQuery } from "@tanstack/react-query";
import { clubNotificationService } from "@/services/clubNotificationService";
import { GetClubNoticeDetailResponseResult, GetClubNoticesResponseResult } from "@/types/clubnotification";



export const clubNoticeQueryKeys = {
  list: (clubId: number, page: number) =>
    ["clubs", clubId, "notices", "list", page] as const,

  detail: (clubId: number, noticeId: number) =>
    ["clubs", clubId, "notices", noticeId, "detail"] as const,
};

export function useClubNoticesQuery(clubId: number, page: number = 1) {
  return useQuery<GetClubNoticesResponseResult>({
    queryKey: clubNoticeQueryKeys.list(clubId, page),
    enabled: Number.isFinite(clubId) && Number.isFinite(page),
    queryFn: () => clubNotificationService.getNotices({ clubId, page }),
  });
}


export function useClubNoticeDetailQuery(clubId: number, noticeId: number) {
  return useQuery<GetClubNoticeDetailResponseResult>({
    queryKey: clubNoticeQueryKeys.detail(clubId, noticeId),
    enabled: Number.isFinite(clubId) && Number.isFinite(noticeId),
    queryFn: () => clubNotificationService.getNoticeDetail({ clubId, noticeId }),
  });
}