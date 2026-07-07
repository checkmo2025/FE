import { API_BASE_URL } from "../../endpoints/base";

export const ADMIN_CLUBS = {
  list: `${API_BASE_URL}/admin/clubs`,

  detail: (clubId: number) =>
    `${API_BASE_URL}/admin/clubs/${clubId}`,

  activeMembers: (clubId: number) =>
    `${API_BASE_URL}/admin/clubs/${clubId}/active-members`,
};
