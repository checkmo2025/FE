import { API_BASE_URL } from "../endpoints";

export const CLUBS = {
  create: `${API_BASE_URL}/clubs`, // POST /api/clubs
  checkName: `${API_BASE_URL}/clubs/check-name`, // GET /api/clubs/check-name?clubName=
  myClubs: `${API_BASE_URL}/me/clubs`,
  recommendations: `${API_BASE_URL}/clubs/recommendations`,
  search: `${API_BASE_URL}/clubs/search`,
  join: (clubId: number) => `${API_BASE_URL}/clubs/${clubId}/join`,
} as const;