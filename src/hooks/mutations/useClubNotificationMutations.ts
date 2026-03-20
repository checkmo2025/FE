import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubNotificationService } from "@/services/clubNotificationService";
import { clubNoticeQueryKeys } from "@/hooks/queries/useClubNotificationQueries";
import {
  CreateClubNoticeRequest,
  UpdateClubNoticeRequest,
  VoteClubNoticeRequest,
} from "@/types/clubnotification";

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
      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.lists(variables.clubId),
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
      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.detail(variables.clubId, variables.noticeId),
      });

      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.lists(variables.clubId),
      });
    },
  });
}

type DeleteNoticeVariables = {
  clubId: number;
  noticeId: number;
};

export function useDeleteClubNoticeMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, noticeId }: DeleteNoticeVariables) =>
      clubNotificationService.deleteNotice({ clubId, noticeId }),

    onSuccess: async (_result, variables) => {
      qc.removeQueries({
        queryKey: clubNoticeQueryKeys.detail(variables.clubId, variables.noticeId),
      });

      qc.removeQueries({
        queryKey: clubNoticeQueryKeys.comments(variables.clubId, variables.noticeId),
      });

      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.lists(variables.clubId),
      });
    },
  });
}

type VoteNoticeVariables = {
  clubId: number;
  noticeId: number;
  voteId: number;
  body: VoteClubNoticeRequest;
};

export function useVoteClubNoticeMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, noticeId, voteId, body }: VoteNoticeVariables) =>
      clubNotificationService.voteNotice({ clubId, noticeId, voteId, body }),

    onSuccess: async (_result, variables) => {
      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.detail(variables.clubId, variables.noticeId),
      });
    },
  });
}