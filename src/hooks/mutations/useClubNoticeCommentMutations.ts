import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubNotificationService } from "@/services/clubNotificationService";
import { clubNoticeQueryKeys } from "@/hooks/queries/useClubNotificationQueries";
import {
  CreateClubNoticeCommentRequest,
  UpdateClubNoticeCommentRequest,
} from "@/types/clubnotification";

type CreateNoticeCommentVariables = {
  clubId: number;
  noticeId: number;
  body: CreateClubNoticeCommentRequest;
};

export function useCreateClubNoticeCommentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, noticeId, body }: CreateNoticeCommentVariables) =>
      clubNotificationService.createNoticeComment({ clubId, noticeId, body }),

    onSuccess: async (_result, variables) => {
      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.comments(variables.clubId, variables.noticeId),
      });
    },
  });
}

type UpdateNoticeCommentVariables = {
  clubId: number;
  noticeId: number;
  commentId: number;
  body: UpdateClubNoticeCommentRequest;
};

export function useUpdateClubNoticeCommentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, noticeId, commentId, body }: UpdateNoticeCommentVariables) =>
      clubNotificationService.updateNoticeComment({
        clubId,
        noticeId,
        commentId,
        body,
      }),

    onSuccess: async (_result, variables) => {
      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.comments(variables.clubId, variables.noticeId),
      });
    },
  });
}

type DeleteNoticeCommentVariables = {
  clubId: number;
  noticeId: number;
  commentId: number;
};

export function useDeleteClubNoticeCommentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, noticeId, commentId }: DeleteNoticeCommentVariables) =>
      clubNotificationService.deleteNoticeComment({
        clubId,
        noticeId,
        commentId,
      }),

    onSuccess: async (_result, variables) => {
      await qc.invalidateQueries({
        queryKey: clubNoticeQueryKeys.comments(variables.clubId, variables.noticeId),
      });
    },
  });
}