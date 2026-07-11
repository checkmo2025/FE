"use client";

import { useMutation } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";

export const useClubNameCheckMutation = () => {
  return useMutation({
    mutationFn: async (clubName: string) => {
      const res = await clubService.checkNameDuplicate(clubName);
      return res.result; // true(중복), false(사용가능)
    },
  });
};