// src/services/meetingService.ts
import { apiClient } from "@/lib/api/client";
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type { ApiResponse } from "@/lib/api/types";

import type {
  GetMeetingDetailResponse,
  GetMeetingDetailResponseResult,
} from "@/types/groups/meetingDetail";

import type {
  GetMeetingMembersResponse,
  GetMeetingMembersResponseResult,
  TeamMemberListPutBody,
} from "@/types/groups/bookcasedetail";

export const meetingService = {
  // GET /api/clubs/{clubId}/meetings/{meetingId}
  getMeetingDetail: async (params: {
    clubId: number;
    meetingId: number;
  }): Promise<GetMeetingDetailResponseResult> => {
    const { clubId, meetingId } = params;

    const res = await apiClient.get<GetMeetingDetailResponse>(
      CLUBS.meetingDetail(clubId, meetingId)
    );

    return res.result;
  },

  // GET /api/clubs/{clubId}/meetings/{meetingId}/members
  getMeetingMembers: async (params: {
    clubId: number;
    meetingId: number;
  }): Promise<GetMeetingMembersResponseResult> => {
    const { clubId, meetingId } = params;

    const res = await apiClient.get<GetMeetingMembersResponse>(
      CLUBS.meetingMembers(clubId, meetingId)
    );

    return res.result;
  },

  // PUT /api/clubs/{clubId}/meetings/{meetingId}/teams
  // 응답에 result가 없으니 return void 처리 (이건 예외로 깔끔하게)
  updateMeetingTeams: async (params: {
    clubId: number;
    meetingId: number;
    body: TeamMemberListPutBody;
  }): Promise<void> => {
    const { clubId, meetingId, body } = params;

    await apiClient.put<ApiResponse<null>>(
      CLUBS.meetingTeams(clubId, meetingId),
      body
    );
  },
};