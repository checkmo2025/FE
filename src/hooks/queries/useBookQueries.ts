import {
    type InfiniteData,
    type QueryClient,
    useInfiniteQuery,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import type { BookSearchResponse } from "@/types/book";

export const bookKeys = {
    all: ["books"] as const,
    search: (title: string) => [...bookKeys.all, "search", title] as const,
    infiniteSearch: (title: string) => [...bookKeys.all, "infiniteSearch", title] as const,
    recommend: () => [...bookKeys.all, "recommend"] as const,
    detail: (isbn: string) => [...bookKeys.all, "detail", isbn] as const,
    likedBooks: (nickname?: string) => [...bookKeys.all, "likedBooks", nickname || "me"] as const,
};

export const useBookSearchQuery = (keyword: string) => {
    return useQuery({
        queryKey: bookKeys.search(keyword),
        queryFn: () => bookService.searchBooks(keyword),
        enabled: keyword.trim().length > 0,
    });
};

export const useInfiniteBookSearchQuery = (keyword: string) => {
    return useInfiniteQuery({
        queryKey: bookKeys.infiniteSearch(keyword),
        queryFn: ({ pageParam }) => bookService.searchBooks(keyword, pageParam),
        initialPageParam: 1,
        enabled: keyword.trim().length > 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.currentPage + 1;
        },
    });
};

export const useRecommendedBooksQuery = () => {
    return useQuery({
        queryKey: bookKeys.recommend(),
        queryFn: () => bookService.getRecommendedBooks(),
        staleTime: 1000 * 60 * 60, // 1 hour (recommended books don't change often)
    });
};

const getCachedBookLikeState = (queryClient: QueryClient, isbn: string) => {
    const likedStates: boolean[] = [];
    const recommendedBook = queryClient
        .getQueryData<BookSearchResponse>(bookKeys.recommend())
        ?.detailInfoList.find((book) => book.isbn === isbn);

    if (recommendedBook?.likedByMe !== undefined) {
        likedStates.push(recommendedBook.likedByMe);
    }

    const searchQueries = queryClient.getQueriesData<InfiniteData<BookSearchResponse>>({
        queryKey: [...bookKeys.all, "infiniteSearch"],
    });

    searchQueries.forEach(([, searchData]) => {
        searchData?.pages.forEach((page) => {
            const book = page.detailInfoList.find((item) => item.isbn === isbn);
            if (book?.likedByMe !== undefined) {
                likedStates.push(book.likedByMe);
            }
        });
    });

    if (likedStates.includes(true)) return true;
    if (likedStates.length > 0) return false;
    return undefined;
};

export const useBookDetailQuery = (isbn: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: bookKeys.detail(isbn),
        queryFn: async () => {
            const book = await bookService.getBookDetail(isbn);
            const cachedLikeState = getCachedBookLikeState(queryClient, isbn);

            if (book.likedByMe || cachedLikeState === undefined) {
                return book;
            }

            return {
                ...book,
                likedByMe: cachedLikeState,
            };
        },
        enabled: !!isbn,
    });
};

export const useLikedBooksInfiniteQuery = (nickname?: string) => {
    return useInfiniteQuery({
        queryKey: bookKeys.likedBooks(nickname),
        queryFn: ({ pageParam }) => bookService.getLikedBooks(nickname, pageParam),
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
    });
};
