import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";

export const bookKeys = {
    all: ["books"] as const,
    search: (title: string) => [...bookKeys.all, "search", title] as const,
    infiniteSearch: (title: string) => [...bookKeys.all, "infiniteSearch", title] as const,
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
