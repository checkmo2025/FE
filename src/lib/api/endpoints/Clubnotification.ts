import { API_BASE_URL } from "../endpoints";

export const CLUB_NOTIFICATION = {
  // GET  /api/clubs/{clubId}/notices
  // POST /api/clubs/{clubId}/notices
  notices: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/notices`,

  noticeDetail: (clubId: number, noticeId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}`,

  noticeComments: (clubId: number, noticeId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}/comments`,



  updateNotice: (clubId: number, noticeId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}`,

  deleteNotice: (clubId: number, noticeId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}`,
} as const;