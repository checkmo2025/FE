const API_BASE_URL = "https://api.checkmo.co.kr/api/v1";

export const ADMIN_STORIES = {
  list: (page = 1, keyword = "") =>
    `${API_BASE_URL}/admin/book-stories?page=${page}&keyword=${encodeURIComponent(keyword)}`,

  detail: (bookStoryId: number) =>
    `${API_BASE_URL}/admin/book-stories/${bookStoryId}`,

  delete: (bookStoryId: number) =>
    `${API_BASE_URL}/admin/book-stories/${bookStoryId}`,

  deleteComment: (bookStoryId: number, commentId: number) =>
    `${API_BASE_URL}/admin/book-stories/${bookStoryId}/comments/${commentId}`,
};
