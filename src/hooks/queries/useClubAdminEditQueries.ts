// src/hooks/queries/useClubAdminEditQueries.ts
import { useQuery } from "@tanstack/react-query";
import { clubService } from "@/services/clubService";

export const clubAdminEditQueryKeys = {
  detail: (clubId: number) => ["clubAdminEdit", "detail", clubId] as const,
};

export function useClubAdminDetailQuery(clubId: number) {
  return useQuery({
    queryKey: clubAdminEditQueryKeys.detail(clubId),
    queryFn: () => clubService.getAdminClubDetail(clubId),
    // queryFn: () => getAdminClubDetail(clubId),
    enabled: Number.isFinite(clubId) && clubId > 0,
    retry: false,
  });
}