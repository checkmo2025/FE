const API_BASE_URL = "https://api.checkmo.co.kr";

export const ADMIN_STORIES = {
  list: (page = 0, size = 20) =>
    `${API_BASE_URL}/api/admin/book-stories?page=${page}&size=${size}`,
  detail: (bookStoryId: number) =>
    `${API_BASE_URL}/api/admin/book-stories/${bookStoryId}`,

};