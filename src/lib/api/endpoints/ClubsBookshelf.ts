import { API_BASE_URL } from "@/lib/api/endpoints";

export const CLUBS_BOOKSHELF_ENDPOINTS = {
  
  simpleBookshelves: (clubId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves`,
  
  SEARCH_BOOKS: `${API_BASE_URL}/books/search`,
  CREATE_BOOKSHELF: (clubId: number | string) =>`${API_BASE_URL}/clubs/${clubId}/bookshelves`,

  // 책장 상세, 삭제, 수정
  detail: (clubId: number | string, meetingId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}`,
  delete: (clubId: number | string, meetingId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}`,
  editGet: (clubId: number | string, meetingId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}/edit`,
  patch: (clubId: number | string, meetingId: number | string) =>`${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}`,

  // 발제한줄평
  topics: (clubId: number | string, meetingId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}/topics`,
  topic: (clubId: number | string, meetingId: number | string, topicId: number | string) =>  `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}/topics/${topicId}`,
  reviews: (clubId: number | string, meetingId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}/reviews`,
  review: (clubId: number | string, meetingId: number | string, reviewId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}/reviews/${reviewId}`,
} as const;