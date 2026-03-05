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

            const previousMyLikes = queryClient.getQueriesData<InfiniteData<MyLikedBooksResponse>>({
                queryKey: bookKeys.myLikes(),
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

            const updateLikedBooksCache = (old: InfiniteData<MyLikedBooksResponse> | undefined) => {
                if (!old || !old.pages) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        books: page.books
                            .map((book) =>
                                book.isbn === isbn ? { ...book, likedByMe: !book.likedByMe } : book
                            )
                            // '좋아요'를 취소하는 경우(현재 true -> false), 목록에서 즉시 제거
                            // 단, 다른 사람의 서재일 경우에는 내가 좋아요를 취소해도 그 사람의 목록에서 사라지면 안 됨 (내가 좋아요를 한 책만 모아둔 '내 서재' 와는 다름)
                            // 하지만 이 로직은 '내 서재'에 특화된 로직이었음. 
                            // 만약 queryKey가 'myLikes' 거나 'likedBooks' 인데 nickname이 'me' 면 필터링 수행.
                            .filter((book) => {
                                // queryKey 구조를 보고 'me' 인지 확인해야 함. 
                                // 여기서는 queryKey 정보를 넘겨받지 않으므로 일단 안전하게 유지하되, 
                                // '내 서재' 인지 여부를 판단할 수 있는 로직이 필요함.
                                return true; // 일단 필터링을 빼거나, queryKey를 같이 넘겨줌.
                            }),
                    })),
                };
            };

            // 위 로직을 좀 더 정교하게 수정: 내 서재에서만 필터링 되도록.
            const handleLikedBooksUpdate = (queryKey: any, oldData: any) => {
                if (!oldData) return;
                const isMyLibrary = queryKey.includes("myLikes") || (queryKey.includes("likedBooks") && queryKey.includes("me"));

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

            previousMyLikes.forEach(([queryKey, oldData]) => handleLikedBooksUpdate(queryKey, oldData));
            previousLikedBooks.forEach(([queryKey, oldData]) => handleLikedBooksUpdate(queryKey, oldData));

            return { previousRecommended, previousDetail, previousSearches, previousMyLikes, previousLikedBooks };
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
            queryClient.invalidateQueries({ queryKey: bookKeys.myLikes() });
            queryClient.invalidateQueries({ queryKey: [...bookKeys.all, "likedBooks"] });
        },
    });
};
