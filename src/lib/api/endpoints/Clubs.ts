import { API_BASE_URL } from "../endpoints";

export const CLUBS = {
  create: `${API_BASE_URL}/clubs`, // POST /api/clubs
  checkName: `${API_BASE_URL}/clubs/check-name`, // GET /api/clubs/check-name?clubName=
  myClubs: `${API_BASE_URL}/me/clubs`,
  recommendations: `${API_BASE_URL}/clubs/recommendations`,
  search: `${API_BASE_URL}/clubs/search`,
  join: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/join`,

  // 나의 상태 조회: GET /api/clubs/{clubId}/me
  me: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/me`,

  // 모임 홈: GET /api/clubs/{clubId}/home
  home: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/home`,

  // 최신 공지 1개: GET /api/clubs/{clubId}/notices/latest
  latestNotice: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/notices/latest`,

  // 이번 모임 바로가기: GET /api/clubs/{clubId}/meetings/next
  nextMeeting: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/meetings/next`,

  members: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/members`, // GET
  member: (clubId: number, clubMemberId: number) =>
    `${API_BASE_URL}/clubs/${clubId}/members/${clubMemberId}`, // PATCH
} as const;