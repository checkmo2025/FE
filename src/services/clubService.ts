// src/services/clubService.ts
import { apiClient } from "@/lib/api/client";
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type { ApiResponse } from "@/lib/api/types";
import { CreateClubRequest } from "@/types/groups/clubCreate";
import type 
  ClubJoinRequest,
  ClubJoinResponse,
  ClubSearchParams,
  ClubSearchResponse,
  MyClubsResponse,
  RecommendationsResponse,
} from "@/types/groups/clubsearch";

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

  getRecommendations: async () => {
    const res = await apiClient.get<RecommendationsResponse>(
      CLUBS.recommendations
    );
    return res.result;
  },

  searchClubs: async (params: ClubSearchParams) => {
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
};

