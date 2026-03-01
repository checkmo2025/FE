import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubNotificationService } from "@/services/clubNotificationService";
import { clubNoticeQueryKeys } from "@/hooks/queries/useClubNotificationQueries";
import { CreateClubNoticeRequest, UpdateClubNoticeRequest } from "@/types/clubnotification";


type CreateNoticeVariables = {
  clubId: number;
  body: CreateClubNoticeRequest;
};

export function useCreateClubNoticeMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, body }: CreateNoticeVariables) =>
      clubNotificationService.createNotice({ clubId, body }),

    onSuccess: async (_result, variables) => {
      // ✅ 작성 성공 시: 목록 갱신
      // 페이지네이션이라 “현재 보고 있는 page”를 UI가 알지만,
      // 여기서는 안전하게 list 전체 prefix로 invalidate 때림.
      await qc.invalidateQueries({
        queryKey: ["clubs", variables.clubId, "notices"],
      });
    },
  });
}

type UpdateNoticeVariables = {
  clubId: number;
  noticeId: number;
  body: UpdateClubNoticeRequest;
};

export function useUpdateClubNoticeMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, noticeId, body }: UpdateNoticeVariables) =>
      clubNotificationService.updateNotice({ clubId, noticeId, body }),

    onSuccess: async (_result, variables) => {
      //  상세 갱신
      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.detail(variables.clubId, variables.noticeId),
      });
      // 목록도 갱신
      await qc.invalidateQueries({
        queryKey: ["clubs", variables.clubId, "notices"],
      });
    },
  });
}