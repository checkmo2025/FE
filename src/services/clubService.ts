// src/services/clubService.ts
import { apiClient } from "@/lib/api/client";
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type { ApiResponse } from "@/lib/api/types";
import { ClubAdminDetailResponse, UpdateClubAdminRequest, UpdateClubAdminResponse } from "@/types/groups/clubAdminEdit";
import { CreateClubRequest } from "@/types/groups/clubCreate";
import { ClubJoinRequest, ClubJoinResponse, ClubSearchParams, ClubSearchResponse, MyClubsResponse, RecommendationsResponse } from "@/types/groups/clubsearch";
import { ClubHomeResponse, ClubHomeResponseResult, LatestNoticeResponse, MyClubStatusResponse, MyClubStatusResponseResult, NextMeetingResponse } from "@/types/groups/grouphome";


export const clubService = {
  // GET /api/clubs/check-name?clubName=...
  // result: boolean (보통 true=중복, false=사용가능)
  checkNameDuplicate: (clubName: string) =>
    apiClient.get<ApiResponse<boolean>>(CLUBS.checkName, {
      params: { clubName },
    }),

  // POST /api/clubs
  createClub: (payload: CreateClubRequest) =>
    apiClient.post<ApiResponse<string>>(CLUBS.create, payload),


  getMyClubs: async () => {
    const res = await apiClient.get<MyClubsResponse>(CLUBS.myClubs);
    return res.result;
  },

  getMemberClubs: async (memberNickname: string) => {
    const res = await apiClient.get<MyClubsResponse>(CLUBS.memberClubs, {
      params: { memberNickname },
    });
    return res.result;
  },

  getRecommendations: async () => {
    const res = await apiClient.get<RecommendationsResponse>(
      CLUBS.recommendations
    );
    return res.result;
  },

  searchClubs: async (params: ClubSearchParams) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: any = { ...params };
    if (cleaned.cursorId == null) delete cleaned.cursorId;
    if (typeof cleaned.keyword === "string" && cleaned.keyword.trim() === "") {
      delete cleaned.keyword;
    }
    if (cleaned.inputFilter == null) delete cleaned.inputFilter;

    const res = await apiClient.get<ClubSearchResponse>(CLUBS.search, {
      params: cleaned,
    });
    return res.result;
  },

  joinClub: async (clubId: number, body: ClubJoinRequest) => {
    const res = await apiClient.post<ClubJoinResponse>(
      CLUBS.join(clubId),
      body
    );
    return res.result;
  },

  getMyStatus: async (clubId: number): Promise<MyClubStatusResponseResult> => {
    const res = await apiClient.get<MyClubStatusResponse>(CLUBS.me(clubId));
    return res.result;
  },

  getClubHome: async (clubId: number): Promise<ClubHomeResponseResult> => {
    const res = await apiClient.get<ClubHomeResponse>(CLUBS.home(clubId));
    return res.result;
  },

  getLatestNotice: async (clubId: number) => {
    try {
      const res = await apiClient.get<LatestNoticeResponse>(CLUBS.latestNotice(clubId));
      return res.result;
    } catch (e: any) {
      const msg = e?.message ?? "";
      if (
        msg.includes("공지") && (msg.includes("없") || msg.includes("존재하지"))
      ) {
        return null;
      }
      throw e;
    }
  },

  getNextMeeting: async (clubId: number) => {
    try {
      const res = await apiClient.get<NextMeetingResponse>(CLUBS.nextMeeting(clubId));
      return res.result;
    } catch (e: any) {
      const msg = e?.message ?? "";
      if (msg.includes("다음 정기모임이 존재하지 않습니다")) {
        return null;
      }
      if (msg.includes("정기모임") && (msg.includes("없") || msg.includes("존재하지"))) {
        return null;
      }
      throw e;
    }
  },
  getAdminClubDetail: async (clubId: number) => {
    const res = await apiClient.get<ClubAdminDetailResponse>(CLUBS.detail(clubId));
    return res.result;
  },
  updateAdminClub: async (clubId: number, body: UpdateClubAdminRequest) => {
    const res = await apiClient.put<UpdateClubAdminResponse>(CLUBS.update(clubId), body);
    return res.result;
  },

  leaveClub: async (clubId: number) => {
    const res = await apiClient.delete<ApiResponse<string>>(CLUBS.leave(clubId));
    return res.result;
  },

};

