import { API_BASE_URL } from "../endpoints";

export const CLUBS = {
  create: `${API_BASE_URL}/clubs`, // POST /api/clubs
  checkName: `${API_BASE_URL}/clubs/check-name`, // GET /api/clubs/check-name?clubName=
  myClubs: `${API_BASE_URL}/me/clubs`,
  recommendations: `${API_BASE_URL}/clubs/recommendations`,
  search: `${API_BASE_URL}/clubs/search`,
  join: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/join`,
  leave: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/leave`,

  me: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/me`,
  home: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/home`,
  latestNotice: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/notices/latest`,
  nextMeeting: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/meetings/next`,

  members: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/members`, // GET
  member: (clubId: number, clubMemberId: number) => `${API_BASE_URL}/clubs/${clubId}/members/${clubMemberId}`, // PATCH

  detail: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}`,
  update: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}`,


  meetingDetail: (clubId: number, meetingId: number) => `${API_BASE_URL}/clubs/${clubId}/meetings/${meetingId}`,

  meetingMembers: (clubId: number, meetingId: number) => `${API_BASE_URL}/clubs/${clubId}/meetings/${meetingId}/members`,


  meetingTeams: (clubId: number, meetingId: number) => `${API_BASE_URL}/clubs/${clubId}/meetings/${meetingId}/teams`,
} as const;