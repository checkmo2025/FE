import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import { bookKeys } from "../queries/useBookQueries";
import { Book, BookSearchResponse } from "@/types/book";
import { toast } from "react-hot-toast";

// Throttle map to prevent spam clicking (per isbn)
const likeThrottleMap: Record<string, number> = {};

const updateLikeInBookList = (old: BookSearchResponse | undefined, isbn: string) => {
    if (!old || !old.detailInfoList) return old;
    return {
        ...old,
        detailInfoList: old.detailInfoList.map((book) => {
            if (book.isbn === isbn) {
                return {
                    ...book,
                    likedByMe: !book.likedByMe,
                };
            }
            return book;
        }),
    };
};

const updateLikeInInfiniteSearch = (old: InfiniteData<BookSearchResponse> | undefined, isbn: string) => {
    if (!old || !old.pages) return old;
    return {
        ...old,
        pages: old.pages.map((page) => ({
            ...page,
            detailInfoList: page.detailInfoList.map((book) => {
                if (book.isbn === isbn) {
                    return {
                        ...book,
                        likedByMe: !book.likedByMe,
                    };
                }
                return book;
            }),
        })),
    };
};

export const useToggleBookLikeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (isbn: string) => {
            const now = Date.now();
            const lastTime = likeThrottleMap[isbn] || 0;

            // Throttle: 500ms
            if (now - lastTime < 500) {
                return Promise.reject(new Error("Throttled request"));
            }
            likeThrottleMap[isbn] = now;

            return bookService.toggleLike(isbn);
        },
        onMutate: async (isbn: string) => {
            await queryClient.cancelQueries({ queryKey: bookKeys.all });

            const previousRecommended = queryClient.getQueryData<BookSearchResponse>(bookKeys.recommend());
            const previousDetail = queryClient.getQueryData<Book>(bookKeys.detail(isbn));

            // Grab all infiniteSearch queries
            const previousSearches = queryClient.getQueriesData<InfiniteData<BookSearchResponse>>({
                queryKey: [...bookKeys.all, "infiniteSearch"],
            });

            if (previousRecommended) {
                queryClient.setQueryData<BookSearchResponse>(bookKeys.recommend(), (old) =>
                    updateLikeInBookList(old, isbn)
                );
            }

            if (previousDetail) {
                queryClient.setQueryData<Book>(bookKeys.detail(isbn), (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        likedByMe: !old.likedByMe,
                    };
                });
            }

            previousSearches.forEach(([queryKey, oldData]) => {
                if (oldData) {
                    queryClient.setQueryData<InfiniteData<BookSearchResponse>>(queryKey, (old) =>
                        updateLikeInInfiniteSearch(old, isbn)
                    );
                }
            });

            return { previousRecommended, previousDetail, previousSearches };
        },
        onError: (err, isbn, context) => {
            if (err.message === "Throttled request") return;

            console.error("Failed to toggle book like:", err);
            toast.error("좋아요 상태 업데이트에 실패했습니다.");

            if (context?.previousRecommended) {
                queryClient.setQueryData(bookKeys.recommend(), context.previousRecommended);
            }
            if (context?.previousDetail) {
                queryClient.setQueryData(bookKeys.detail(isbn), context.previousDetail);
            }
            if (context?.previousSearches) {
                context.previousSearches.forEach(([queryKey, oldData]) => {
                    queryClient.setQueryData(queryKey, oldData);
                });
            }
        },
        onSuccess: (data, isbn) => {
            // Update cache with the actual response from server
            const { liked } = data;

            queryClient.setQueryData<BookSearchResponse>(bookKeys.recommend(), (old) => {
                if (!old || !old.detailInfoList) return old;
                return {
                    ...old,
                    detailInfoList: old.detailInfoList.map(book =>
                        book.isbn === isbn ? { ...book, likedByMe: liked } : book
                    )
                };
            });

            queryClient.setQueryData<Book>(bookKeys.detail(isbn), (old) => {
                if (!old) return old;
                return { ...old, likedByMe: liked };
            });

            const searches = queryClient.getQueriesData<InfiniteData<BookSearchResponse>>({
                queryKey: [...bookKeys.all, "infiniteSearch"],
            });

            searches.forEach(([queryKey, oldData]) => {
                if (oldData) {
                    queryClient.setQueryData<InfiniteData<BookSearchResponse>>(queryKey, (old) => {
                        if (!old || !old.pages) return old;
                        return {
                            ...old,
                            pages: old.pages.map(page => ({
                                ...page,
                                detailInfoList: page.detailInfoList.map(book =>
                                    book.isbn === isbn ? { ...book, likedByMe: liked } : book
                                )
                            }))
                        };
                    });
                }
            });
        },
    });
};
