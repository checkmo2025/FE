import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meetingService } from "@/services/meetingService";
import type { TeamMemberListPutBody } from "@/types/groups/bookcasedetail";
import { meetingQueryKeys } from "@/hooks/queries/useMeetingQueries";

export const useUpdateMeetingTeamsMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["meeting", "teams", "update"],
    mutationFn: (args: { clubId: number; meetingId: number; body: TeamMemberListPutBody }) =>
      meetingService.updateMeetingTeams(args),

    onSuccess: async (_, vars) => {
      const detailKey = meetingQueryKeys.detail(vars.clubId, vars.meetingId);
      const membersKey = meetingQueryKeys.members(vars.clubId, vars.meetingId);

      await Promise.all([
        qc.invalidateQueries({ queryKey: detailKey }),
        qc.invalidateQueries({ queryKey: membersKey }),

        qc.prefetchQuery({
          queryKey: detailKey,
          queryFn: () =>
            meetingService.getMeetingDetail({
              clubId: vars.clubId,
              meetingId: vars.meetingId,
            }),
        }),

        qc.prefetchQuery({
          queryKey: membersKey,
          queryFn: () =>
            meetingService.getMeetingMembers({
              clubId: vars.clubId,
              meetingId: vars.meetingId,
            }),
        }),
      ]);
    },
  });
};