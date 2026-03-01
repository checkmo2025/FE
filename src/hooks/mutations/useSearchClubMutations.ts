"use client";

import { useMutation } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";
import type { ClubJoinRequest } from "@/types/groups/clubsearch";

type Vars = { clubId: number; body: ClubJoinRequest };

export function useClubJoinMutation() {
  return useMutation<string, Error, Vars>({
    mutationFn: ({ clubId, body }) => clubService.joinClub(clubId, body),
  });
}