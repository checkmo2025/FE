import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { clubsBookshelfService } from "@/services/clubsBookshelfService";
import type {
  BooksSearchResponse,
  BookshelfEditGetResult,
} from "@/types/bookshelf";

export function useClubsBookshelfSimpleInfiniteQuery(clubId: number) {
  return useInfiniteQuery({
    queryKey: ["clubs", clubId, "bookshelves", "simple"],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      clubsBookshelfService.getSimpleBookshelves({
        clubId,
        cursorId: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}

export function useClubsBookshelfBookSearchInfiniteQuery(keyword: string) {
  const trimmed = keyword.trim();

  return useInfiniteQuery({
    queryKey: ["books", "search", trimmed],
    enabled: trimmed.length > 0, // keyword 필수
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      clubsBookshelfService.searchBooks({
        keyword: trimmed,
        page: pageParam,
      }),
    getNextPageParam: (lastPage: BooksSearchResponse) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
  });
}

export function useBookshelfEditQuery(clubId: number, meetingId: number) {
  return useQuery<BookshelfEditGetResult>({
    queryKey: ["clubs", clubId, "bookshelves", meetingId, "edit"],
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId),
    queryFn: () => clubsBookshelfService.getEdit(clubId, meetingId),
  });
}