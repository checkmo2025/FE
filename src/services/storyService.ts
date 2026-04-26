import { apiClient } from "@/lib/api/client";
import { STORY_ENDPOINTS } from "@/lib/api/endpoints/bookstory";
import { BookStoryListResponse, BookStoryDetail, CreateBookStoryRequest } from "@/types/story";
import { ApiResponse } from "@/types/auth";

export const storyService = {
    getAllStories: async (cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.LIST,
            {
                params: cursorId !== undefined ? { cursorId } : undefined
            }
        );
        return response.result!;
    },
    getFollowingStories: async (cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.FOLLOWING,
            {
                params: cursorId !== undefined ? { cursorId } : undefined
            }
        );
        return response.result!;
    },
    // 특정 모임의 클럽 책 이야기 조회 
    getClubStories: async (clubId: number, cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.CLUB(clubId),
            {
                params: cursorId !== undefined ? { cursorId } : undefined
            }
        );
        return response.result!;
    },

    getMyStories: async (cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.ME,
            {
                params: cursorId !== undefined ? { cursorId } : undefined
            }
        );
        return response.result!;
    },
    getOtherMemberStories: async (nickname: string, cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.OTHER_MEMBER(nickname),
            {
                params: cursorId !== undefined ? { cursorId } : undefined
            }
        );
        return response.result!;
    },
    getStoriesByBookId: async (bookId: string, cursorId?: number): Promise<BookStoryListResponse> => {
        const response = await apiClient.get<ApiResponse<BookStoryListResponse>>(
            STORY_ENDPOINTS.SEARCH_BY_BOOK(bookId),
            {
                params: cursorId !== undefined ? { cursorId } : undefined
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
        // 백엔드가 Request Param과 Body 중 어느 곳을 기대할지 모호한 경우를 대비하여 둘 다 전달
        const requestBody = parentCommentId ? { ...data, parentCommentId } : data;
        const response = await apiClient.post<ApiResponse<number>>(
            `${STORY_ENDPOINTS.LIST}/${bookStoryId}/comments`,
            requestBody,
            {
                params: { parentCommentId }
            }
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
