import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { meetingChatService } from "@/services/meetingChatService";
import type { GetMeetingChatsResponseResult } from "@/types/groups/meetingChats";

export const meetingChatQueryKeys = {
  list: (clubId: number, meetingId: number, teamId: number) =>
    ["clubs", clubId, "meetings", meetingId, "teams", teamId, "chats"] as const,
};

export function useMeetingChatsInfiniteQuery(
  clubId: number,
  meetingId: number,
  teamId: number,
  enabled = true
) {
  return useInfiniteQuery<
    GetMeetingChatsResponseResult,
    Error,
    InfiniteData<GetMeetingChatsResponseResult, number | null>,
    ReturnType<typeof meetingChatQueryKeys.list>,
    number | null
  >({
    queryKey: meetingChatQueryKeys.list(clubId, meetingId, teamId),
    enabled:
      Number.isFinite(clubId) &&
      Number.isFinite(meetingId) &&
      Number.isFinite(teamId) &&
      enabled,
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      meetingChatService.getMeetingChats({
        clubId,
        meetingId,
        teamId,
        cursorId: pageParam ?? null,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}