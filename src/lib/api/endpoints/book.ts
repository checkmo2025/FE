import { API_BASE_URL } from "./base";

export const BOOK_ENDPOINTS = {
    SEARCH: `${API_BASE_URL}/books/search`,
    RECOMMEND: `${API_BASE_URL}/books/recommend`,
    DETAIL: (isbn: string) => `${API_BASE_URL}/books/${isbn}`,
    LIKE: (isbn: string) => `${API_BASE_URL}/books/${isbn}/like`,
    MY_LIKES: `${API_BASE_URL}/books/me/likes`,
    OTHER_LIKES: (nickname: string) => `${API_BASE_URL}/books/${encodeURIComponent(nickname)}/likes`,
};
