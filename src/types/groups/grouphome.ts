// 공통 응답 포맷
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 1) 나의 상태 조회: GET /api/clubs/{clubId}/me
export type MyClubStatus =
  | "NONE"
  | "PENDING"
  | "MEMBER"
  | "STAFF"
  | "OWNER"
  | "WITHDRAWN"
  | "KICKED";

export interface MyClubStatusResponseResult {
  clubId: number;
  myStatus: MyClubStatus;
  active: boolean;
  staff: boolean; // 관리자/운영진 여부 (이걸로 isAdmin 판단)
}

export type MyClubStatusResponse = ApiResponse<MyClubStatusResponseResult>;

// 2) 모임 홈: GET /api/clubs/{clubId}/home
export interface ClubCategory {
  code: string;
  description: string;
}

export interface ParticipantType {
  code: string;
  description: string;
}

export interface ClubLinkItem {
  link: string;
  label: string;
}

export interface ClubHomeResponseResult {
  clubId: number;
  name: string;
  description: string;
  profileImageUrl: string;
  region: string;
  category: ClubCategory[];
  participantTypes: ParticipantType[];
  links: ClubLinkItem[];
  open: boolean;
}

export type ClubHomeResponse = ApiResponse<ClubHomeResponseResult>;

// 3) 최신 공지 1개: GET /api/clubs/{clubId}/notices/latest
export interface LatestNoticeResponseResult {
  id: number;
  title: string;
}

export type LatestNoticeResponse = ApiResponse<LatestNoticeResponseResult>;

// 4) 이번 모임 바로가기: GET /api/clubs/{clubId}/meetings/next
export interface NextMeetingResponseResult {
  meetingId: number;
  redirectUrl: string;
}

export type NextMeetingResponse = ApiResponse<NextMeetingResponseResult>;


export const CLUB_CATEGORY_CODE_TO_NUM: Record<string, number> = {
  TRAVEL: 1,
  FOREIGN_LANGUAGE: 2,
  CHILD_TEEN: 3,
  RELIGION_PHILOSOPHY: 4,
  FICTION_POETRY_DRAMA: 5,
  ESSAY: 6,
  HUMANITIES: 7,
  SCIENCE: 8,
  COMPUTER_IT: 9,
  ECONOMY_BUSINESS: 10,
  SELF_IMPROVEMENT: 11,
  SOCIAL_SCIENCE: 12,
  POLITICS_DIPLOMACY_DEFENSE: 13,
  HISTORY_CULTURE: 14,
  ART_POP_CULTURE: 15,
};