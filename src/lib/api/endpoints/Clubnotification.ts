import { API_BASE_URL } from "../endpoints";

export const CLUB_NOTIFICATION = {
  // GET / POST
  notices: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/notices`,

  // GET / PATCH / DELETE
  noticeDetail: (clubId: number, noticeId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}`,

  // POST
  noticeVote: (clubId: number, noticeId: number, voteId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}/votes/${voteId}`,

  // GET / POST
  noticeComments: (clubId: number, noticeId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}/comments`,

  // PATCH / DELETE
  noticeCommentDetail: (clubId: number, noticeId: number, commentId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/notices/${noticeId}/comments/${commentId}`,
} as const;