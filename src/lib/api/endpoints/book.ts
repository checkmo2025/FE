import { API_BASE_URL } from "./base";

export const BOOK_ENDPOINTS = {
    SEARCH: `${API_BASE_URL}/books/search`,
    RECOMMEND: `${API_BASE_URL}/books/recommend`,
    DETAIL: (isbn: string) => `${API_BASE_URL}/books/${isbn}`,
};
