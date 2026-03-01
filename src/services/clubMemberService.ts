// src/services/clubMemberService.ts
import { apiClient } from "@/lib/api/client";
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type { ApiResponse } from "@/lib/api/types";
import type {
  GetClubMembersParams,
  GetClubMembersResult,
  UpdateClubMemberStatusRequest,
} from "@/types/groups/clubMembers";

export const clubMemberService = {
  // GET /api/clubs/{clubId}/members?status=...&cursorId=...
  getClubMembers: async (params: GetClubMembersParams): Promise<GetClubMembersResult> => {
    const { clubId, status, cursorId } = params;

    const res = await apiClient.get<ApiResponse<GetClubMembersResult>>(CLUBS.members(clubId), {
      params: {
        status,
        cursorId: cursorId ?? null,
      },
    });

    return res.result;
  },

  // PATCH /api/clubs/{clubId}/members/{clubMemberId}
  updateClubMemberStatus: async (
    clubId: number,
    clubMemberId: number,
    body: UpdateClubMemberStatusRequest
  ): Promise<string> => {
    const res = await apiClient.patch<ApiResponse<string>>(CLUBS.member(clubId, clubMemberId), body);
    return res.result;
  },
};