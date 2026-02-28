import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { clubsBookshelfService } from "@/services/clubsBookshelfService";
import type {
  BooksSearchResponse,
  BookshelfEditGetResult,
  BookshelfDetailResponseResult,
  TopicsResponseResult,
  ReviewsResponseResult,
} from "@/types/bookshelf";
import type { InfiniteData } from "@tanstack/react-query";

export const bookshelfQueryKeys = {
  simple: (clubId: number) => ["clubs", clubId, "bookshelves", "simple"] as const,
  search: (keyword: string) => ["books", "search", keyword] as const,

  edit: (clubId: number, meetingId: number) =>
    ["clubs", clubId, "bookshelves", meetingId, "edit"] as const,

  //  책장 상세
  detail: (clubId: number, meetingId: number) =>
    ["clubs", clubId, "bookshelves", meetingId, "detail"] as const,

  //  발제/한줄평 
  topics: (clubId: number, meetingId: number) =>
    ["clubs", clubId, "bookshelves", meetingId, "topics"] as const,
  reviews: (clubId: number, meetingId: number) =>
    ["clubs", clubId, "bookshelves", meetingId, "reviews"] as const,
};

export function useClubsBookshelfSimpleInfiniteQuery(clubId: number, p0: { enabled: boolean; }) {
  return useInfiniteQuery({
    queryKey: bookshelfQueryKeys.simple(clubId),
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      clubsBookshelfService.getSimpleBookshelves({
        clubId,
        cursorId: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
    enabled: Number.isFinite(clubId),
  });
}

export function useClubsBookshelfBookSearchInfiniteQuery(keyword: string) {
  const trimmed = keyword.trim();

  return useInfiniteQuery({
    queryKey: bookshelfQueryKeys.search(trimmed),
    enabled: trimmed.length > 0,
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
    queryKey: bookshelfQueryKeys.edit(clubId, meetingId),
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId),
    queryFn: () => clubsBookshelfService.getEdit(clubId, meetingId),
  });
}

export function useBookshelfDetailQuery(clubId: number, meetingId: number) {
  return useQuery<BookshelfDetailResponseResult>({
    queryKey: bookshelfQueryKeys.detail(clubId, meetingId),
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId),
    queryFn: () =>
      clubsBookshelfService.getBookshelfDetail({
        clubId,
        meetingId,
      }),
  });
}


export function useBookshelfTopicsInfiniteQuery(clubId: number, meetingId: number) {
  return useInfiniteQuery<
    TopicsResponseResult,
    Error,
    InfiniteData<TopicsResponseResult, number | null>, 
    ReturnType<typeof bookshelfQueryKeys.topics>,
    number | null
  >({
    queryKey: bookshelfQueryKeys.topics(clubId, meetingId),
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId),
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      clubsBookshelfService.getTopics({
        clubId,
        meetingId,
        cursorId: pageParam ?? null,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}

export function useBookshelfReviewsInfiniteQuery(clubId: number, meetingId: number) {
  return useInfiniteQuery<
    ReviewsResponseResult,
    Error,
    InfiniteData<ReviewsResponseResult, number | null>,
    ReturnType<typeof bookshelfQueryKeys.reviews>,
    number | null
  >({
    queryKey: bookshelfQueryKeys.reviews(clubId, meetingId),
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId),
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      clubsBookshelfService.getReviews({
        clubId,
        meetingId,
        cursorId: pageParam ?? null,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}
