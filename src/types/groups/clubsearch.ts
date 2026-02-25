import { ApiResponse } from "@/lib/api/types";

export type MyClubItem = {
  clubId: number;
  clubName: string;
};

export type MyClubsResult = {
  clubList: MyClubItem[];
};

export type MyClubsResponse = ApiResponse<MyClubsResult>;

// ===== 2) 모임 추천: GET /api/clubs/recommendations =====
export type ClubCategoryDTO = {
  code: string;
  description: string;
};

export type ParticipantTypeDTO = {
  code: string; // ex) STUDENT, WORKER...
  description: string;
};

export type ClubLinkDTO = {
  link: string;
  label: string;
};

export type ClubDTO = {
  clubId: number;
  name: string;
  description: string;
  profileImageUrl: string | null;
  region: string;
  category: ClubCategoryDTO[];
  participantTypes: ParticipantTypeDTO[];
  links: ClubLinkDTO[];
  open: boolean;
};

export type ClubInfoDTO = {
  club: ClubDTO;
  myStatus: string; // NONE, REQUESTED, MEMBER ... (백엔드 enum 확정 전)
};

export type RecommendationItemDTO = {
  rank: number;
  clubInfo: ClubInfoDTO;
  overlapCount: number;
  activeMemberCount: number;
  lastActivityAt: string;
};

export type RecommendationsResult = {
  recommendations: RecommendationItemDTO[];
};

export type RecommendationsResponse = ApiResponse<RecommendationsResult>;

// ===== 3) 모임 검색: GET /api/clubs/search =====
export type InputFilter = "NAME" | "REGION";

export type OutputFilter =
  | "ALL"
  | "STUDENT"
  | "WORKER"
  | "ONLINE"
  | "CLUB"
  | "MEETING"
  | "OFFLINE";

export type ClubListItemDTO = {
  club: ClubDTO;
  myStatus: string;
};

export type ClubSearchResult = {
  clubList: ClubListItemDTO[];
  hasNext: boolean;
  nextCursor: number | null;
};

export type ClubSearchResponse = ApiResponse<ClubSearchResult>;

export type ClubSearchParams = {
  keyword?: string;          
  inputFilter?: InputFilter | null;
  outputFilter: OutputFilter;
  cursorId?: number | null;
};

// ===== 4) 모임 가입 신청: POST /api/clubs/{clubId}/join =====
export type ClubJoinRequest = {
  joinMessage: string;
};

export type ClubJoinResponse = ApiResponse<string>;