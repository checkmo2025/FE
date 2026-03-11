import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_MEMBER_ENDPOINTS = {
  GET_MEMBER_EMAILS: `${API_BASE_URL}/admin/members/emails`,
} as const;