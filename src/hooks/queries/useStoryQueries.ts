import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyService } from "@/services/storyService";
import { CreateBookStoryRequest } from "@/types/story";

export const storyKeys = {
    all: ["stories"] as const,
    list: () => [...storyKeys.all, "list"] as const,
    infiniteList: () => [...storyKeys.all, "infiniteList"] as const,
    detail: (id: number) => [...storyKeys.all, "detail", id] as const,
};

export const useStoriesQuery = () => {
    return useQuery({
        queryKey: storyKeys.list(),
        queryFn: () => storyService.getAllStories(),
    });
};

export const useStoryDetailQuery = (id: number) => {
    return useQuery({
        queryKey: storyKeys.detail(id),
        queryFn: () => storyService.getStoryById(id),
        enabled: !!id,
    });
};

export const useInfiniteStoriesQuery = () => {
    return useInfiniteQuery({
        queryKey: storyKeys.infiniteList(),
        queryFn: ({ pageParam }) => storyService.getAllStories(pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
    });
};

export const useCreateBookStoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBookStoryRequest) => storyService.createBookStory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storyKeys.all });
        },
    });
};
