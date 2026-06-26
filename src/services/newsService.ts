import { apiClient } from "@/lib/api/client";
import { NEWS_ENDPOINTS } from "@/lib/api/endpoints/news";
import { NewsListResponse, NewsDetail } from "@/types/news";
import { ApiResponse } from "@/types/auth";

import { SitemapListResponse } from "@/types/sitemap";

export const newsService = {
    getNewsSitemap: async (cursorId?: number, limit: number = 1000): Promise<SitemapListResponse> => {
        const response = await apiClient.get<ApiResponse<SitemapListResponse>>(
            NEWS_ENDPOINTS.SITEMAP,
            { params: { cursorId, limit } }
        );
        return response.result!;
    },
    getNewsList: async (cursorId?: number): Promise<NewsListResponse> => {
        const url = new URL(NEWS_ENDPOINTS.GET_NEWS_LIST);
        if (cursorId !== undefined && cursorId !== null) {
            url.searchParams.append("cursorId", cursorId.toString());
        }

        const response = await apiClient.get<ApiResponse<NewsListResponse>>(
            url.toString()
        );
        return response.result!;
    },
    getMyNewsList: async (cursorId?: number): Promise<NewsListResponse> => {
        const url = new URL(NEWS_ENDPOINTS.GET_MY_NEWS);
        if (cursorId !== undefined && cursorId !== null) {
            url.searchParams.append("cursorId", cursorId.toString());
        }

        const response = await apiClient.get<ApiResponse<NewsListResponse>>(
            url.toString()
        );
        return response.result!;
    },
    getNewsDetail: async (newsId: number): Promise<NewsDetail> => {
        const response = await apiClient.get<ApiResponse<NewsDetail>>(
            NEWS_ENDPOINTS.GET_DETAIL(newsId)
        );
        return response.result!;
    },
};
