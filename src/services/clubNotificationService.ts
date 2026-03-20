import { apiClient } from "@/lib/api/client";
import { CLUB_NOTIFICATION } from "@/lib/api/endpoints/Clubnotification";
import {
  CreateClubNoticeCommentRequest,
  CreateClubNoticeCommentResponse,
  CreateClubNoticeCommentResponseResult,
  CreateClubNoticeRequest,
  CreateClubNoticeResponse,
  CreateClubNoticeResponseResult,
  DeleteClubNoticeCommentResponse,
  DeleteClubNoticeCommentResponseResult,
  DeleteClubNoticeResponse,
  DeleteClubNoticeResponseResult,
  GetClubNoticeCommentsResponse,
  GetClubNoticeCommentsResponseResult,
  GetClubNoticeDetailResponse,
  GetClubNoticeDetailResponseResult,
  GetClubNoticesResponse,
  GetClubNoticesResponseResult,
  UpdateClubNoticeCommentRequest,
  UpdateClubNoticeCommentResponse,
  UpdateClubNoticeCommentResponseResult,
  UpdateClubNoticeRequest,
  UpdateClubNoticeResponse,
  UpdateClubNoticeResponseResult,
  VoteClubNoticeRequest,
  VoteClubNoticeResponse,
  VoteClubNoticeResponseResult,
} from "@/types/clubnotification";

export const clubNotificationService = {
  /** 공지 목록 조회 */
  getNotices: async (params: {
    clubId: number;
    page?: number;
  }): Promise<GetClubNoticesResponseResult> => {
    const { clubId, page = 1 } = params;

    const res = await apiClient.get<GetClubNoticesResponse>(
      CLUB_NOTIFICATION.notices(clubId),
      { params: { page } }
    );

    return res.result;
  },

  /** 공지 작성 */
  createNotice: async (params: {
    clubId: number;
    body: CreateClubNoticeRequest;
  }): Promise<CreateClubNoticeResponseResult> => {
    const { clubId, body } = params;

    const res = await apiClient.post<CreateClubNoticeResponse>(
      CLUB_NOTIFICATION.notices(clubId),
      body
    );

    return res.result;
  },

  /** 공지 상세 조회 */
  getNoticeDetail: async (params: {
    clubId: number;
    noticeId: number;
  }): Promise<GetClubNoticeDetailResponseResult> => {
    const { clubId, noticeId } = params;

    const res = await apiClient.get<GetClubNoticeDetailResponse>(
      CLUB_NOTIFICATION.noticeDetail(clubId, noticeId)
    );

    return res.result;
  },

  /** 공지 수정 */
  updateNotice: async (params: {
    clubId: number;
    noticeId: number;
    body: UpdateClubNoticeRequest;
  }): Promise<UpdateClubNoticeResponseResult> => {
    const { clubId, noticeId, body } = params;

    const res = await apiClient.patch<UpdateClubNoticeResponse>(
      CLUB_NOTIFICATION.noticeDetail(clubId, noticeId),
      body
    );

    return res.result;
  },

  /** 공지 삭제 */
  deleteNotice: async (params: {
    clubId: number;
    noticeId: number;
  }): Promise<DeleteClubNoticeResponseResult> => {
    const { clubId, noticeId } = params;

    const res = await apiClient.delete<DeleteClubNoticeResponse>(
      CLUB_NOTIFICATION.noticeDetail(clubId, noticeId)
    );

    return res.result;
  },

  /** 공지 투표 */
  voteNotice: async (params: {
    clubId: number;
    noticeId: number;
    voteId: number;
    body: VoteClubNoticeRequest;
  }): Promise<VoteClubNoticeResponseResult> => {
    const { clubId, noticeId, voteId, body } = params;

    const res = await apiClient.post<VoteClubNoticeResponse>(
      CLUB_NOTIFICATION.noticeVote(clubId, noticeId, voteId),
      body
    );

    return res.result;
  },

  /** 공지 댓글 조회 */
  getNoticeComments: async (params: {
    clubId: number;
    noticeId: number;
    cursorId?: number | null;
  }): Promise<GetClubNoticeCommentsResponseResult> => {
    const { clubId, noticeId, cursorId = null } = params;

    const res = await apiClient.get<GetClubNoticeCommentsResponse>(
      CLUB_NOTIFICATION.noticeComments(clubId, noticeId),
      {
        params: { cursorId },
      }
    );

    return res.result;
  },

  /** 공지 댓글 작성 */
  createNoticeComment: async (params: {
    clubId: number;
    noticeId: number;
    body: CreateClubNoticeCommentRequest;
  }): Promise<CreateClubNoticeCommentResponseResult> => {
    const { clubId, noticeId, body } = params;

    const res = await apiClient.post<CreateClubNoticeCommentResponse>(
      CLUB_NOTIFICATION.noticeComments(clubId, noticeId),
      body
    );

    return res.result;
  },

  /** 공지 댓글 수정 */
  updateNoticeComment: async (params: {
    clubId: number;
    noticeId: number;
    commentId: number;
    body: UpdateClubNoticeCommentRequest;
  }): Promise<UpdateClubNoticeCommentResponseResult> => {
    const { clubId, noticeId, commentId, body } = params;

    const res = await apiClient.patch<UpdateClubNoticeCommentResponse>(
      CLUB_NOTIFICATION.noticeCommentDetail(clubId, noticeId, commentId),
      body
    );

    return res.result;
  },

  /** 공지 댓글 삭제 */
  deleteNoticeComment: async (params: {
    clubId: number;
    noticeId: number;
    commentId: number;
  }): Promise<DeleteClubNoticeCommentResponseResult> => {
    const { clubId, noticeId, commentId } = params;

    const res = await apiClient.delete<DeleteClubNoticeCommentResponse>(
      CLUB_NOTIFICATION.noticeCommentDetail(clubId, noticeId, commentId)
    );

    return res.result;
  },
} as const;