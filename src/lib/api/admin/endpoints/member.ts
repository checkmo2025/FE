import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_MEMBER_ENDPOINTS = {
  GET_MEMBERS: `${API_BASE_URL}/admin/members`,
  GET_MEMBER_DETAIL: (nickname: string) =>
    `${API_BASE_URL}/admin/members/${nickname}`,
  GET_MEMBER_REPORTS: (nickname: string) =>
    `${API_BASE_URL}/admin/members/${nickname}/reports`,
  GET_MEMBER_EMAILS: `${API_BASE_URL}/admin/members/emails`,
} as const;