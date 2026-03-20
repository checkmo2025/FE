import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_NEWS_ENDPOINTS = {
  GET_ADMIN_NEWS_LIST: `${API_BASE_URL}/admin/news`,
  GET_ADMIN_NEWS_DETAIL: (newsId: number) => `${API_BASE_URL}/admin/news/${newsId}`,
} as const;