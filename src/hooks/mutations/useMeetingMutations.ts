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

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: meetingQueryKeys.members(vars.clubId, vars.meetingId) });
      qc.invalidateQueries({ queryKey: meetingQueryKeys.detail(vars.clubId, vars.meetingId) });
    },
  });
};