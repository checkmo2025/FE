import { apiClient } from "@/lib/api/client";
import { STORY_ENDPOINTS } from "@/lib/api/endpoints/bookstory";
import { BookStoryListResponse, BookStoryDetail } from "@/types/story";
import { ApiResponse } from "@/types/auth";

export const storyService = {
    getAllStories: async (cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.LIST,
            {
                params: { cursorId },
            }
        );
        return response.result!;
    },
    getStoryById: async (id: number): Promise<BookStoryDetail> => {
        const response = await apiClient.get<ApiResponse<BookStoryDetail>>(
            `${STORY_ENDPOINTS.LIST}/${id}`
        );
        return response.result!;
    },
};
