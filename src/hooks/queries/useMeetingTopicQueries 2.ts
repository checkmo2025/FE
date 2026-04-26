import { useQuery } from "@tanstack/react-query";
import { meetingTopicService } from "@/services/meetingTopicService";
import type { GetMeetingTopicsResponseResult } from "@/types/groups/meetingTopics";

export const meetingTopicQueryKeys = {
  list: (clubId: number, meetingId: number, teamId: number) =>
    ["clubs", clubId, "meetings", meetingId, "teams", teamId, "topics"] as const,
};

export function useMeetingTopicsQuery(
  clubId: number,
  meetingId: number,
  teamId: number,
  enabled = true
) {
  return useQuery<GetMeetingTopicsResponseResult>({
    queryKey: meetingTopicQueryKeys.list(clubId, meetingId, teamId),
    enabled:
      Number.isFinite(clubId) &&
      Number.isFinite(meetingId) &&
      Number.isFinite(teamId) &&
      enabled,
    queryFn: () => meetingTopicService.getMeetingTopics({ clubId, meetingId, teamId }),
  });
}