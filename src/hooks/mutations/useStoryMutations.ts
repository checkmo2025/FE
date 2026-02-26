import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storyService } from "@/services/storyService";
import { CreateBookStoryRequest, storyKeys } from "@/hooks/queries/useStoryQueries";

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
        },
    });
};

export const useToggleStoryLikeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookStoryId: number) => storyService.toggleLikeStory(bookStoryId),
        onMutate: async (bookStoryId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: storyKeys.all });

            // Snapshot the previous values
            const previousInfiniteStories = queryClient.getQueryData(storyKeys.infiniteList());
            const previousMyStories = queryClient.getQueryData(storyKeys.myList());
            const previousStories = queryClient.getQueryData(storyKeys.list());
            const previousStoryDetail = queryClient.getQueryData(storyKeys.detail(bookStoryId));

            // Optimistically update the infinite list
            if (previousInfiniteStories) {
                queryClient.setQueryData(storyKeys.infiniteList(), (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            basicInfoList: page.basicInfoList.map((story: any) => {
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
                });
            }

            // Optimistically update my stories
            if (previousMyStories) {
                queryClient.setQueryData(storyKeys.myList(), (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            basicInfoList: page.basicInfoList.map((story: any) => {
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
                });
            }

            // Optimistically update the regular list (if used)
            if (previousStories) {
                queryClient.setQueryData(storyKeys.list(), (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        basicInfoList: old.basicInfoList.map((story: any) => {
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
                });
            }

            // Optimistically update the detail view
            if (previousStoryDetail) {
                queryClient.setQueryData(storyKeys.detail(bookStoryId), (old: any) => {
                    if (!old) return old;
                    const nextLiked = !old.likedByMe;
                    return {
                        ...old,
                        likedByMe: nextLiked,
                        likes: nextLiked ? old.likes + 1 : old.likes - 1,
                    };
                });
            }

            return {
                previousInfiniteStories,
                previousMyStories,
                previousStories,
                previousStoryDetail,
            };
        },
        onError: (err, bookStoryId, context) => {
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
        },
        onSettled: (data, err, bookStoryId) => {
            // Invalidate queries to ensure sync with server
            queryClient.invalidateQueries({ queryKey: storyKeys.infiniteList() });
            queryClient.invalidateQueries({ queryKey: storyKeys.myList() });
            queryClient.invalidateQueries({ queryKey: storyKeys.list() });
            queryClient.invalidateQueries({ queryKey: storyKeys.detail(bookStoryId) });
        },
    });
};
