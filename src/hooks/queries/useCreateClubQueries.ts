"use client";

import { useQuery } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";

export const useClubNameCheckQuery = (clubName: string) => {
  const name = clubName.trim();

  return useQuery({
    queryKey: ["clubs", "check-name", name],
    queryFn: async () => {
      const res = await clubService.checkNameDuplicate(name);
      return res.result;
    },
    enabled: false,
  });
};