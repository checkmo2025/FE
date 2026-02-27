import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubsBookshelfService } from "@/services/clubsBookshelfService";
import type { CreateBookshelfRequest, BookshelfPatchRequest } from "@/types/bookshelf";

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
      // edit 조회 갱신
      qc.invalidateQueries({
        queryKey: ["clubs", vars.clubId, "bookshelves", vars.meetingId, "edit"],
      });
      // 목록도 필요하면 갱신
      qc.invalidateQueries({
        queryKey: ["clubs", vars.clubId, "bookshelves", "simple"],
      });
    },
  });
};