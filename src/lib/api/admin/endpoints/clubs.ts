import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_CLUBS = {
  list: (page = 0, size = 20) =>
    `${API_BASE_URL}/admin/clubs?page=${page}&size=${size}`,

  detail: (clubId: number) =>
    `${API_BASE_URL}/admin/clubs/${clubId}`,
};