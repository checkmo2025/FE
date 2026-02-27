import { API_BASE_URL } from "@/lib/api/endpoints";

export const CLUBS_BOOKSHELF_ENDPOINTS = {
  
  simpleBookshelves: (clubId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves`,
  
  SEARCH_BOOKS: `${API_BASE_URL}/books/search`,
  CREATE_BOOKSHELF: (clubId: number | string) =>`${API_BASE_URL}/clubs/${clubId}/bookshelves`,

  editGet: (clubId: number | string, meetingId: number | string) => `${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}/edit`,
  patch: (clubId: number | string, meetingId: number | string) =>`${API_BASE_URL}/clubs/${clubId}/bookshelves/${meetingId}`,
} as const;