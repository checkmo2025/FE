import { apiClient } from "@/lib/api/client";
import { CLUB_NOTIFICATION } from "@/lib/api/endpoints/Clubnotification";
import { CreateClubNoticeRequest, CreateClubNoticeResponse, CreateClubNoticeResponseResult, DeleteClubNoticeResponse, DeleteClubNoticeResponseResult, GetClubNoticeDetailResponse, GetClubNoticeDetailResponseResult, GetClubNoticesResponse, GetClubNoticesResponseResult, UpdateClubNoticeRequest, UpdateClubNoticeResponse, UpdateClubNoticeResponseResult } from "@/types/clubnotification";



export const clubNotificationService = {
  /** 공지 목록 조회 (페이지네이션) */
  getNotices: async (params: {
    clubId: number;
    page?: number; // default 1
  }): Promise<GetClubNoticesResponseResult> => {
    const { clubId, page = 1 } = params;

    const res = await apiClient.get<GetClubNoticesResponse>(
      CLUB_NOTIFICATION.notices(clubId),
      { params: { page } }
    );

    return res.result;
  },

  /** 공지 작성 (투표 포함) */
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

  /** 공지 수정 (투표 deadline / pin 포함) */
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
  
} as const;


