import { apiClient } from "@/lib/api/client";

// 신욱
import { CLUB_ENDPOINTS } from "@/lib/api/endpoints/club";
import type { MyClubListResponse } from "@/types/club";
import type { ApiResponse as AuthApiResponse } from "@/types/auth";

// 기현
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type { ApiResponse } from "@/lib/api/types";
import type { CreateClubRequest } from "@/types/groups/clubCreate";
import type {
  ClubJoinRequest,
  ClubJoinResponse,
  ClubSearchParams,
  ClubSearchResponse,
  MyClubsResponse,
  RecommendationsResponse,
} from "@/types/groups/clubsearch";

export const clubService = {

  getMyClubs: async (): Promise<MyClubListResponse> => {
    const response = await apiClient.get<AuthApiResponse<MyClubListResponse>>(
      CLUB_ENDPOINTS.MY_CLUBS
    );
    return response.result!;
  },


  getMyClubsV2: async () => {
    const res = await apiClient.get<MyClubsResponse>(CLUBS.myClubs);
    return res.result;
  },

  // GET /api/clubs/check-name?clubName=...
  checkNameDuplicate: async (clubName: string) => {
    const res = await apiClient.get<ApiResponse<boolean>>(CLUBS.checkName, {
      params: { clubName },
    });
    return res.result;
  },

  // POST /api/clubs
  createClub: async (payload: CreateClubRequest) => {
    const res = await apiClient.post<ApiResponse<string>>(CLUBS.create, payload);
    return res.result;
  },

  // GET /api/clubs/recommendations
  getRecommendations: async () => {
    const res = await apiClient.get<RecommendationsResponse>(CLUBS.recommendations);
    return res.result;
  },

  // GET /api/clubs/search
  searchClubs: async (params: ClubSearchParams) => {
    const cleaned: any = { ...params };
    if (cleaned.cursorId == null) delete cleaned.cursorId;
    if (typeof cleaned.keyword === "string" && cleaned.keyword.trim() === "") delete cleaned.keyword;
    if (cleaned.inputFilter == null) delete cleaned.inputFilter;

    const res = await apiClient.get<ClubSearchResponse>(CLUBS.search, {
      params: cleaned,
    });
    return res.result;
  },

  // POST /api/clubs/{clubId}/join
  joinClub: async (clubId: number, body: ClubJoinRequest) => {
    const res = await apiClient.post<ClubJoinResponse>(CLUBS.join(clubId), body);
    return res.result;
  },
};

