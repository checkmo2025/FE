"use client";

import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { clubService } from "@/services/clubService";
import type {
  ClubSearchParams,
  ClubSearchResult,
  MyClubsResult,
  RecommendationsResult,
} from "@/types/groups/clubsearch";

export const clubQueryKeys = {
  myClubs: ["clubs", "my"] as const,
  recommendations: ["clubs", "recommendations"] as const,
  search: (params: Omit<ClubSearchParams, "cursorId">) =>
    ["clubs", "search", params] as const,
};

export function useMyClubsQuery() {
  return useQuery<MyClubsResult>({
    queryKey: clubQueryKeys.myClubs,
    queryFn: clubService.getMyClubs,
  });
}

export function useClubRecommendationsQuery(enabled: boolean) {
  return useQuery<RecommendationsResult>({
    queryKey: clubQueryKeys.recommendations,
    queryFn: clubService.getRecommendations,
    enabled,
  });
}

export function useInfiniteClubSearchQuery(
  params: Omit<ClubSearchParams, "cursorId">,
  enabled: boolean
) {
  return useInfiniteQuery<
    ClubSearchResult,
    Error,
    InfiniteData<ClubSearchResult>,
    ReturnType<typeof clubQueryKeys.search>,
    number | undefined
  >({
    queryKey: clubQueryKeys.search(params),
    enabled,
    
    initialPageParam: undefined,

    queryFn: ({ pageParam }) =>
      clubService.searchClubs({
        ...params,
        cursorId: pageParam, // undefined면 service가 제거해줌
      }),

    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}