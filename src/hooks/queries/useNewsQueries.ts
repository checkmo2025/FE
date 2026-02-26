import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { newsService } from "@/services/newsService";
import { NewsListResponse } from "@/types/news";

export const newsKeys = {
    all: ["news"] as const,
    list: () => [...newsKeys.all, "list"] as const,
    infiniteList: () => [...newsKeys.all, "infiniteList"] as const,
};

export const useInfiniteNewsQuery = () => {
    return useInfiniteQuery({
        queryKey: newsKeys.infiniteList(),
        // 임시 MOCK 데이터 함수 연결 (운영 배포 전 newsService.getNewsList 로 복구)
        queryFn: ({ pageParam }) => newsService.getNewsList(pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
    });
};
