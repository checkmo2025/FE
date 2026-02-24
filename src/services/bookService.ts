import { apiClient } from "@/lib/api/client";
import { BOOK_ENDPOINTS } from "@/lib/api/endpoints/book";
import { ApiResponse } from "@/types/auth";
import { BookSearchResponse } from "@/types/book";

export const bookService = {
    searchBooks: async (title: string, cursorId?: number): Promise<BookSearchResponse> => {
        const response = await apiClient.get<ApiResponse<BookSearchResponse>>(
            BOOK_ENDPOINTS.SEARCH,
            {
                params: {
                    title,
                    cursorId
                },
            }
        );
        return response.result!;
    },
};
