import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_CLUBS = {
  list: (page = 0, size = 20, keyword = "") =>
    `${API_BASE_URL}/admin/clubs?page=${page}&size=${size}&keyword=${keyword}`,

  detail: (clubId: number) =>
    `${API_BASE_URL}/admin/clubs/${clubId}`,

  activeMembers: (clubId: number, page = 0, size = 20) =>
    `${API_BASE_URL}/admin/clubs/${clubId}/active-members?page=${page}&size=${size}`,
};