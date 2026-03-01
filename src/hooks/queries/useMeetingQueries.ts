import { useQuery } from "@tanstack/react-query";
import { meetingService } from "@/services/meetingService";
import type { GetMeetingDetailResponseResult } from "@/types/groups/meetingDetail";
import type { GetMeetingMembersResponseResult } from "@/types/groups/bookcasedetail";

export const meetingQueryKeys = {
  detail: (clubId: number, meetingId: number) =>
    ["clubs", clubId, "meetings", meetingId, "detail"] as const,
  members: (clubId: number, meetingId: number) =>
    ["clubs", clubId, "meetings", meetingId, "members"] as const,
};

export function useMeetingDetailQuery(clubId: number, meetingId: number) {
  return useQuery<GetMeetingDetailResponseResult>({
    queryKey: meetingQueryKeys.detail(clubId, meetingId),
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId),
    queryFn: () => meetingService.getMeetingDetail({ clubId, meetingId }),
  });
}

export function useMeetingMembersQuery(clubId: number, meetingId: number) {
  return useQuery<GetMeetingMembersResponseResult>({
    queryKey: meetingQueryKeys.members(clubId, meetingId),
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId),
    queryFn: () => meetingService.getMeetingMembers({ clubId, meetingId }),
  });
}