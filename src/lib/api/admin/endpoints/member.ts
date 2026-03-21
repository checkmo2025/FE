import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_MEMBER_ENDPOINTS = {
  GET_MEMBERS: `${API_BASE_URL}/admin/members`,
  GET_MEMBER_DETAIL: (nickname: string) =>
    `${API_BASE_URL}/admin/members/${nickname}`,
  GET_MEMBER_REPORTS: (nickname: string) =>
    `${API_BASE_URL}/admin/members/${nickname}/reports`,
  GET_MEMBER_EMAILS: `${API_BASE_URL}/admin/members/emails`,
  GET_MEMBER_CLUBS: (nickname: string) =>
    `${API_BASE_URL}/admin/clubs/members/${nickname}`,
  GET_MEMBER_BOOK_STORIES: (nickname: string) =>
  `${API_BASE_URL}/admin/book-stories/members/${nickname}`,
  GET_MEMBER_NEWS: (nickname: string) =>
  `${API_BASE_URL}/admin/news/members/${nickname}`,
} as const;