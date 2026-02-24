import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";

export const bookKeys = {
    all: ["books"] as const,
    search: (title: string) => [...bookKeys.all, "search", title] as const,
    infiniteSearch: (title: string) => [...bookKeys.all, "infiniteSearch", title] as const,
};

export const useBookSearchQuery = (title: string) => {
    return useQuery({
        queryKey: bookKeys.search(title),
        queryFn: () => bookService.searchBooks(title),
        enabled: title.trim().length > 0,
    });
};

export const useInfiniteBookSearchQuery = (title: string) => {
    return useInfiniteQuery({
        queryKey: bookKeys.infiniteSearch(title),
        queryFn: ({ pageParam }) => bookService.searchBooks(title, pageParam ?? undefined),
        initialPageParam: null as number | null,
        enabled: title.trim().length > 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
    });
};
