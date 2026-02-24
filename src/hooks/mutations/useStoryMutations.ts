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
