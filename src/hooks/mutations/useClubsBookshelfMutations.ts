import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubsBookshelfService } from "@/services/clubsBookshelfService";
import type {
  CreateBookshelfRequest,
  BookshelfPatchRequest,
  UpsertTopicRequest,
  UpsertReviewRequest,
} from "@/types/bookshelf";
import { bookshelfQueryKeys } from "@/hooks/queries/useClubsBookshelfQueries";

export const useCreateBookshelfMutation = () => {
  return useMutation({
    mutationKey: ["clubsBookshelf", "create"],
    mutationFn: (args: { clubId: number; body: CreateBookshelfRequest }) =>
      clubsBookshelfService.createBookshelf(args),
  });
};

export const usePatchBookshelfMutation = (clubId: number, meetingId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["clubsBookshelf", "patch"],
    mutationFn: (args: {
      clubId: number;
      meetingId: number;
      body: BookshelfPatchRequest;
    }) => clubsBookshelfService.patch(args.clubId, args.meetingId, args.body),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.edit(vars.clubId, vars.meetingId) });
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.simple(vars.clubId) });
    },
  });
};
export const useDeleteBookshelfMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["bookshelf", "delete"],
    mutationFn: (args: { clubId: number; meetingId: number }) =>
      clubsBookshelfService.deleteBookshelf(args),

    onSuccess: (_, vars) => {
      // 리스트 갱신 (책장 목록에서 삭제 반영)
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.simple(vars.clubId) });

      // 혹시 상세 페이지에 남아있는 캐시 제거(선택)
      qc.removeQueries({ queryKey: bookshelfQueryKeys.detail(vars.clubId, vars.meetingId) });
      qc.removeQueries({ queryKey: bookshelfQueryKeys.topics(vars.clubId, vars.meetingId) });
      qc.removeQueries({ queryKey: bookshelfQueryKeys.reviews(vars.clubId, vars.meetingId) });
      qc.removeQueries({ queryKey: bookshelfQueryKeys.edit(vars.clubId, vars.meetingId) });
    },
  });
};

/** 발제  */
export const useCreateTopicMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["bookshelf", "topic", "create"],
    mutationFn: (args: {
      clubId: number;
      meetingId: number;
      body: UpsertTopicRequest;
    }) => clubsBookshelfService.createTopic(args),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.topics(vars.clubId, vars.meetingId) });
    },
  });
};

export const useUpdateTopicMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["bookshelf", "topic", "update"],
    mutationFn: (args: {
      clubId: number;
      meetingId: number;
      topicId: number;
      body: UpsertTopicRequest;
    }) => clubsBookshelfService.updateTopic(args),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.topics(vars.clubId, vars.meetingId) });
    },
  });
};

export const useDeleteTopicMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["bookshelf", "topic", "delete"],
    mutationFn: (args: { clubId: number; meetingId: number; topicId: number }) =>
      clubsBookshelfService.deleteTopic(args),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.topics(vars.clubId, vars.meetingId) });
    },
  });
};

/** 한줄평  */
export const useCreateReviewMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["bookshelf", "review", "create"],
    mutationFn: (args: {
      clubId: number;
      meetingId: number;
      body: UpsertReviewRequest;
    }) => clubsBookshelfService.createReview(args),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.reviews(vars.clubId, vars.meetingId) });
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.detail(vars.clubId, vars.meetingId) }); // averageRate 갱신
    },
  });
};

export const useUpdateReviewMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["bookshelf", "review", "update"],
    mutationFn: (args: {
      clubId: number;
      meetingId: number;
      reviewId: number;
      body: UpsertReviewRequest;
    }) => clubsBookshelfService.updateReview(args),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.reviews(vars.clubId, vars.meetingId) });
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.detail(vars.clubId, vars.meetingId) });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["bookshelf", "review", "delete"],
    mutationFn: (args: { clubId: number; meetingId: number; reviewId: number }) =>
      clubsBookshelfService.deleteReview(args),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.reviews(vars.clubId, vars.meetingId) });
      qc.invalidateQueries({ queryKey: bookshelfQueryKeys.detail(vars.clubId, vars.meetingId) });
    },
  });
};