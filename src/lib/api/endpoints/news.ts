import { API_BASE_URL } from "./base";

export const NEWS_ENDPOINTS = {
    SITEMAP: `${API_BASE_URL}/news/sitemap`,
    GET_NEWS_LIST: `${API_BASE_URL}/news`,
    GET_MY_NEWS: `${API_BASE_URL}/news/me`,
    GET_DETAIL: (newsId: number) => `${API_BASE_URL}/news/${newsId}`,
};
