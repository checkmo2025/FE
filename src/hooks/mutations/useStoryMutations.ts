import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { storyService } from "@/services/storyService";
import { CreateBookStoryRequest, storyKeys } from "@/hooks/queries/useStoryQueries";
import { toast } from "react-hot-toast";
import { BookStoryListResponse, BookStoryDetail } from "@/types/story";

const updateLikeInStoryList = (old: BookStoryListResponse | undefined, bookStoryId: number) => {
    if (!old || !old.basicInfoList) return old;
    return {
        ...old,
        basicInfoList: old.basicInfoList.map((story) => {
            if (story.bookStoryId === bookStoryId) {
                const nextLiked = !story.likedByMe;
                return {
                    ...story,
                    likedByMe: nextLiked,
                    likes: nextLiked ? story.likes + 1 : story.likes - 1,
                };
            }
            return story;
        }),
    };
};

const updateLikeInInfiniteList = (old: InfiniteData<BookStoryListResponse> | undefined, bookStoryId: number) => {
    if (!old || !old.pages) return old;
    return {
        ...old,
        pages: old.pages.map((page) => ({
            ...page,
            basicInfoList: page.basicInfoList.map((story) => {
                if (story.bookStoryId === bookStoryId) {
                    const nextLiked = !story.likedByMe;
                    return {
                        ...story,
                        likedByMe: nextLiked,
                        likes: nextLiked ? story.likes + 1 : story.likes - 1,
                    };
                }
                return story;
            }),
        })),
    };
};

const updateCommentCountInStoryList = (old: BookStoryListResponse | undefined, bookStoryId: number, delta: number) => {
    if (!old || !old.basicInfoList) return old;
    return {
        ...old,
        basicInfoList: old.basicInfoList.map((story) => {
            if (story.bookStoryId === bookStoryId) {
                return {
                    ...story,
                    commentCount: story.commentCount + delta,
                };
            }
            return story;
        }),
    };
};

const updateCommentCountInInfiniteList = (old: InfiniteData<BookStoryListResponse> | undefined, bookStoryId: number, delta: number) => {
    if (!old || !old.pages) return old;
    return {
        ...old,
        pages: old.pages.map((page) => ({
            ...page,
            basicInfoList: page.basicInfoList.map((story) => {
                if (story.bookStoryId === bookStoryId) {
                    return {
                        ...story,
                        commentCount: story.commentCount + delta,
                    };
                }
                return story;
            }),
        })),
    };
};

// Throttle map to prevent spam clicking (per bookStoryId)
const likeThrottleMap: Record<number, number> = {};

export const useCreateBookStoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBookStoryRequest) => storyService.createBookStory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storyKeys.all });
        },
    });
};

export const useCreateCommentMutation = (bookStoryId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { content: string; parentCommentId?: number }) =>
            storyService.createComment(bookStoryId, { content: args.content }, args.parentCommentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storyKeys.detail(bookStoryId) });
            queryClient.setQueryData<InfiniteData<BookStoryListResponse>>(storyKeys.infiniteList(), (old) =>
                updateCommentCountInInfiniteList(old, bookStoryId, 1)
            );
            queryClient.setQueryData<InfiniteData<BookStoryListResponse>>(storyKeys.myList(), (old) =>
                updateCommentCountInInfiniteList(old, bookStoryId, 1)
            );
            queryClient.setQueriesData<InfiniteData<BookStoryListResponse>>({ queryKey: [...storyKeys.all, "otherMember"] }, (old) =>
                updateCommentCountInInfiniteList(old, bookStoryId, 1)
            );
            queryClient.setQueryData<BookStoryListResponse>(storyKeys.list(), (old) =>
                updateCommentCountInStoryList(old, bookStoryId, 1)
            );
        },
    });
};

export const useUpdateCommentMutation = (bookStoryId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { commentId: number; content: string }) =>
            storyService.updateComment(bookStoryId, args.commentId, { content: args.content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storyKeys.detail(bookStoryId) });
        },
    });
};

export const useDeleteCommentMutation = (bookStoryId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: number) =>
            storyService.deleteComment(bookStoryId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storyKeys.detail(bookStoryId) });
            queryClient.setQueryData<InfiniteData<BookStoryListResponse>>(storyKeys.infiniteList(), (old) =>
                updateCommentCountInInfiniteList(old, bookStoryId, -1)
            );
            queryClient.setQueryData<InfiniteData<BookStoryListResponse>>(storyKeys.myList(), (old) =>
                updateCommentCountInInfiniteList(old, bookStoryId, -1)
            );
            queryClient.setQueriesData<InfiniteData<BookStoryListResponse>>({ queryKey: [...storyKeys.all, "otherMember"] }, (old) =>
                updateCommentCountInInfiniteList(old, bookStoryId, -1)
            );
            queryClient.setQueryData<BookStoryListResponse>(storyKeys.list(), (old) =>
                updateCommentCountInStoryList(old, bookStoryId, -1)
            );
        },
    });
};

export const useToggleStoryLikeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookStoryId: number) => {
            const now = Date.now();
            const lastTime = likeThrottleMap[bookStoryId] || 0;

            // Throttle: 500ms
            if (now - lastTime < 500) {
                return;
            }
            likeThrottleMap[bookStoryId] = now;

            return storyService.toggleLikeStory(bookStoryId);
        },
        onMutate: async (bookStoryId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: storyKeys.all });

            // Snapshot the previous values
            const previousInfiniteStories = queryClient.getQueryData(storyKeys.infiniteList());
            const previousMyStories = queryClient.getQueryData(storyKeys.myList());
            const previousStories = queryClient.getQueryData(storyKeys.list());
            const previousStoryDetail = queryClient.getQueryData(storyKeys.detail(bookStoryId));
            const previousOtherMemberStories = queryClient.getQueriesData({ queryKey: [...storyKeys.all, "otherMember"] });

            // Optimistically update the infinite list
            if (previousInfiniteStories) {
                queryClient.setQueryData<InfiniteData<BookStoryListResponse>>(storyKeys.infiniteList(), (old) =>
                    updateLikeInInfiniteList(old, bookStoryId)
                );
            }

            // Optimistically update my stories
            if (previousMyStories) {
                queryClient.setQueryData<InfiniteData<BookStoryListResponse>>(storyKeys.myList(), (old) =>
                    updateLikeInInfiniteList(old, bookStoryId)
                );
            }

            // Optimistically update other member stories
            queryClient.setQueriesData<InfiniteData<BookStoryListResponse>>({ queryKey: [...storyKeys.all, "otherMember"] }, (old) =>
                updateLikeInInfiniteList(old, bookStoryId)
            );

            // Optimistically update the regular list (if used)
            if (previousStories) {
                queryClient.setQueryData<BookStoryListResponse>(storyKeys.list(), (old) =>
                    updateLikeInStoryList(old, bookStoryId)
                );
            }

            // Optimistically update the detail view
            if (previousStoryDetail) {
                const isLikedAfterMutation = !previousStoryDetail.likedByMe;
                queryClient.setQueryData<BookStoryDetail>(storyKeys.detail(bookStoryId), (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        likedByMe: isLikedAfterMutation,
                        likes: isLikedAfterMutation ? old.likes + 1 : old.likes - 1,
                    };
                });
            }

            return {
                previousInfiniteStories,
                previousMyStories,
                previousStories,
                previousStoryDetail,
                previousOtherMemberStories,
            };
        },
        onError: (err, bookStoryId, context) => {
            console.error("Failed to toggle like:", err);
            toast.error("좋아요 상태 업데이트에 실패했습니다.");

            if (context?.previousInfiniteStories) {
                queryClient.setQueryData(storyKeys.infiniteList(), context.previousInfiniteStories);
            }
            if (context?.previousMyStories) {
                queryClient.setQueryData(storyKeys.myList(), context.previousMyStories);
            }
            if (context?.previousStories) {
                queryClient.setQueryData(storyKeys.list(), context.previousStories);
            }
            if (context?.previousStoryDetail) {
                queryClient.setQueryData(storyKeys.detail(bookStoryId), context.previousStoryDetail);
            }
            if (context?.previousOtherMemberStories) {
                context.previousOtherMemberStories.forEach(([queryKey, oldData]) => {
                    queryClient.setQueryData(queryKey, oldData);
                });
            }
        },
        onSettled: (data, err, bookStoryId) => {
            // Invalidate queries to ensure sync with server
            queryClient.invalidateQueries({ queryKey: storyKeys.infiniteList() });
            queryClient.invalidateQueries({ queryKey: storyKeys.myList() });
            queryClient.invalidateQueries({ queryKey: [...storyKeys.all, "otherMember"] });
            queryClient.invalidateQueries({ queryKey: storyKeys.list() });
            queryClient.invalidateQueries({ queryKey: storyKeys.detail(bookStoryId) });
        },
    });
};
