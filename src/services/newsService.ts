import { apiClient } from "@/lib/api/client";
import { NEWS_ENDPOINTS } from "@/lib/api/endpoints/news";
import { NewsListResponse } from "@/types/news";
import { ApiResponse } from "@/types/auth";

export const newsService = {
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
};
