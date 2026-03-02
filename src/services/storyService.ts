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
    getFollowingStories: async (cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.FOLLOWING,
            {
                params: { cursorId },
            }
        );
        return response.result!;
    },
    getMyStories: async (cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.ME,
            {
                params: { cursorId },
            }
        );
        return response.result!;
    },
    getOtherMemberStories: async (nickname: string, cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.OTHER_MEMBER(nickname),
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
        // 백엔드 명세에 따라 parentCommentId를 body에 포함하여 전송
        const requestBody = parentCommentId ? { ...data, parentCommentId } : data;
        const response = await apiClient.post<ApiResponse<number>>(
            `${STORY_ENDPOINTS.LIST}/${bookStoryId}/comments`,
            requestBody
        );
        return response.result!;
    },
    updateComment: async (
        bookStoryId: number,
        commentId: number,
        data: { content: string }
    ): Promise<number> => {
        const response = await apiClient.patch<ApiResponse<number>>(
            `${STORY_ENDPOINTS.LIST}/${bookStoryId}/comments/${commentId}`,
            data
        );
        return response.result!;
    },
    deleteComment: async (
        bookStoryId: number,
        commentId: number
    ): Promise<null> => {
        const response = await apiClient.delete<ApiResponse<null>>(
            `${STORY_ENDPOINTS.LIST}/${bookStoryId}/comments/${commentId}`
        );
        return response.result!;
    },
    toggleLikeStory: async (bookStoryId: number): Promise<boolean> => {
        const response = await apiClient.post<ApiResponse<boolean>>(
            STORY_ENDPOINTS.LIKE(bookStoryId)
        );
        return response.result!;
    },
};
