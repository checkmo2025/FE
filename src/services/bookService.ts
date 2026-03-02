import { apiClient } from "@/lib/api/client";
import { BOOK_ENDPOINTS } from "@/lib/api/endpoints/book";
import { ApiResponse } from "@/types/auth";
import { Book, BookSearchResponse, MyLikedBooksResponse } from "@/types/book";

export const bookService = {
    searchBooks: async (keyword: string, page: number = 1): Promise<BookSearchResponse> => {
        const response = await apiClient.get<ApiResponse<BookSearchResponse>>(
            BOOK_ENDPOINTS.SEARCH,
            {
                params: {
                    keyword,
                    page
                },
            }
        );
        return response.result!;
    },
    getRecommendedBooks: async (): Promise<BookSearchResponse> => {
        const response = await apiClient.get<ApiResponse<BookSearchResponse>>(
            BOOK_ENDPOINTS.RECOMMEND
        );
        return response.result!;
    },
    getBookDetail: async (isbn: string): Promise<Book> => {
        const response = await apiClient.get<ApiResponse<Book>>(
            BOOK_ENDPOINTS.DETAIL(isbn)
        );
        return response.result!;
    },
    toggleLike: async (isbn: string): Promise<{ isbn: string; liked: boolean; likes: number }> => {
        const response = await apiClient.post<ApiResponse<{ isbn: string; liked: boolean; likes: number }>>(
            BOOK_ENDPOINTS.LIKE(isbn)
        );
        return response.result!;
    },
    getMyLikedBooks: async (cursorId?: number): Promise<MyLikedBooksResponse> => {
        const response = await apiClient.get<ApiResponse<MyLikedBooksResponse>>(
            BOOK_ENDPOINTS.MY_LIKES,
            {
                params: {
                    cursorId
                }
            }
        );
        return response.result!;
    }
};
