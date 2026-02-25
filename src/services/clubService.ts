// src/services/clubService.ts
import { apiClient } from "@/lib/api/client";
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type { ApiResponse } from "@/lib/api/types";
import { CreateClubRequest } from "@/types/groups/clubCreate";


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
};