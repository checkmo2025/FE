// src/hooks/mutations/useClubAdminEditMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clubAdminEditQueryKeys } from "@/hooks/queries/useClubAdminEditQueries";

import type { UpdateClubAdminRequest } from "@/types/groups/clubAdminEdit";

// ✅ clubService가 객체 export인 경우
import { clubService } from "@/services/clubService";
// ✅ 함수 export면 이렇게 바꿔:
// import { updateAdminClub } from "@/services/clubService";

export function useUpdateClubAdminMutation(clubId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateClubAdminRequest) =>
      clubService.updateAdminClub(clubId, body),
    // mutationFn: (body: UpdateClubAdminRequest) => updateAdminClub(clubId, body),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clubAdminEditQueryKeys.detail(clubId) });
    },
  });
}