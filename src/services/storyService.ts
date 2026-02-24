import { apiClient } from "@/lib/api/client";
import { STORY_ENDPOINTS } from "@/lib/api/endpoints/bookstory";
import { BookStoryListResponse, BookStoryDetail, CreateBookStoryRequest } from "@/types/story";
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
    createBookStory: async (data: CreateBookStoryRequest): Promise<number> => {
        const response = await apiClient.post<ApiResponse<number>>(
            STORY_ENDPOINTS.LIST,
            data
        );
        return response.result!;
    },
    createComment: async (
        bookStoryId: number,
        data: { content: string },
        parentCommentId?: number
    ): Promise<number> => {
        const response = await apiClient.post<ApiResponse<number>>(
            `${STORY_ENDPOINTS.LIST}/${bookStoryId}/comments`,
            data,
            {
                params: { parentCommentId }
            }
        );
        return response.result!;
    },
};
