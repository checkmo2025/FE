import { apiClient } from "@/lib/api/client";
import { STORY_ENDPOINTS } from "@/lib/api/endpoints/bookstory";
import { BookStoryListResponse, BookStoryDetail } from "@/types/story";
import { ApiResponse } from "@/types/auth";

export const storyService = {
    getAllStories: async (cursorId?: number): Promise<BookStoryListResponse | undefined> => {
        try {
            const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
                STORY_ENDPOINTS.LIST,
                {
                    params: { cursorId },
                }
            );
            if (response.isSuccess) {
                return response.result;
            }
        } catch (error) {
            console.error("Failed to fetch stories:", error);
        }
        return undefined;
    },
    getStoryById: async (id: number): Promise<BookStoryDetail | undefined> => {
        try {
            const response = await apiClient.get<ApiResponse<BookStoryDetail>>(
                `${STORY_ENDPOINTS.LIST}/${id}`
            );
            if (response.isSuccess) {
                return response.result;
            }
        } catch (error) {
            console.error(`Failed to fetch story ${id}:`, error);
        }
        return undefined;
    },
};
