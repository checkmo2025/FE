import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_NEWS_ENDPOINTS = {
  GET_ADMIN_NEWS_LIST: (page = 0, keyword = "") =>
    `${API_BASE_URL}/admin/news?page=${page}&keyword=${encodeURIComponent(keyword)}`,

  GET_ADMIN_NEWS_DETAIL: (newsId: number) =>
    `${API_BASE_URL}/admin/news/${newsId}`,

  DELETE_ADMIN_NEWS: (newsId: number) =>
    `${API_BASE_URL}/admin/news/${newsId}`,
} as const;