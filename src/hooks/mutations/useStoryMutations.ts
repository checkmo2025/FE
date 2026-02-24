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
