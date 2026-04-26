import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { storyService } from "@/services/storyService";
export type { CreateBookStoryRequest } from "@/types/story";

export const storyKeys = {
    all: ["stories"] as const,
    list: () => [...storyKeys.all, "list"] as const,
    infiniteList: () => [...storyKeys.all, "infiniteList"] as const,
    followingList: () => [...storyKeys.all, "followingList"] as const,
    myList: () => [...storyKeys.all, "myList"] as const,
    clubList: (clubId: number) => [...storyKeys.all, "clubList", clubId] as const,
    otherMember: (nickname: string) => [...storyKeys.all, "otherMember", nickname] as const,
    bookList: (bookId: string) => [...storyKeys.all, "bookList", bookId] as const,
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

export const useFollowingInfiniteStoriesQuery = (enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: storyKeys.followingList(),
        queryFn: ({ pageParam }) => storyService.getFollowingStories(pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
        enabled,
    });
};

export const useMyInfiniteStoriesQuery = () => {
    return useInfiniteQuery({
        queryKey: storyKeys.myList(),
        queryFn: ({ pageParam }) => storyService.getMyStories(pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
    });
};

export const useClubInfiniteStoriesQuery = (clubId: number | null, enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: clubId ? storyKeys.clubList(clubId) : storyKeys.all,
        queryFn: ({ pageParam }) => storyService.getClubStories(clubId!, pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
        enabled: enabled && clubId !== null,
    });
};

export const useOtherMemberInfiniteStoriesQuery = (nickname: string) => {
    return useInfiniteQuery({
        queryKey: storyKeys.otherMember(nickname),
        queryFn: ({ pageParam }) => storyService.getOtherMemberStories(nickname, pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
        enabled: !!nickname,
    });
};

export const useBookInfiniteStoriesQuery = (bookId: string) => {
    return useInfiniteQuery({
        queryKey: storyKeys.bookList(bookId),
        queryFn: ({ pageParam }) => storyService.getStoriesByBookId(bookId, pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
        enabled: !!bookId,
    });
};
