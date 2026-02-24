import { apiClient } from "@/lib/api/client";
import { BOOK_ENDPOINTS } from "@/lib/api/endpoints/book";
import { ApiResponse } from "@/types/auth";
import { BookSearchResponse } from "@/types/book";

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
};
