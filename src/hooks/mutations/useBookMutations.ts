import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import { bookKeys } from "../queries/useBookQueries";
import { Book, BookSearchResponse, MyLikedBooksResponse } from "@/types/book";
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

            const previousLikedBooks = queryClient.getQueriesData<InfiniteData<MyLikedBooksResponse>>({
                queryKey: [...bookKeys.all, "likedBooks"],
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

            // 위 로직을 좀 더 정교하게 수정: 내 서재에서만 필터링 되도록.
            const handleLikedBooksUpdate = (queryKey: readonly unknown[], oldData: InfiniteData<MyLikedBooksResponse> | undefined) => {
                if (!oldData) return;
                // likedBooks 키의 마지막 요소가 "me" 인 경우 "내 서재" 로 판단
                const isMyLibrary = queryKey.includes("me");

                queryClient.setQueryData<InfiniteData<MyLikedBooksResponse>>(queryKey, (old) => {
                    if (!old || !old.pages) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            books: page.books
                                .map((book) =>
                                    book.isbn === isbn ? { ...book, likedByMe: !book.likedByMe } : book
                                )
                                .filter((book) => {
                                    if (isMyLibrary) {
                                        // 내 서재면 좋아요 취소 시 제거
                                        return book.isbn !== isbn || book.likedByMe;
                                    }
                                    return true; // 타인의 서재면 제거하지 않음
                                }),
                        })),
                    };
                });
            };

            previousLikedBooks.forEach(([queryKey, oldData]) => handleLikedBooksUpdate(queryKey, oldData));

            return { previousRecommended, previousDetail, previousSearches, previousLikedBooks };
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
            if (context?.previousLikedBooks) {
                context.previousLikedBooks.forEach(([queryKey, oldData]) => {
                    queryClient.setQueryData(queryKey, oldData);
                });
            }
        },
        onSuccess: (data, isbn) => {
            // Update simple queries with the actual response from server
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

            // Invalidate infinite queries to ensure data consistency
            queryClient.invalidateQueries({ queryKey: [...bookKeys.all, "infiniteSearch"] });
            queryClient.invalidateQueries({ queryKey: [...bookKeys.all, "likedBooks"] });
        },
    });
};
