import { API_BASE_URL } from "../endpoints";

export const CLUBS = {
  create: `${API_BASE_URL}/clubs`, // POST /api/clubs
  checkName: `${API_BASE_URL}/clubs/check-name`, // GET /api/clubs/check-name?clubName=
} as const;