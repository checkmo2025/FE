import { apiClient } from "@/lib/api/client";
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type {
  GetMeetingChatsResponse,
  GetMeetingChatsResponseResult,
} from "@/types/groups/meetingChats";

export const meetingChatService = {
  getMeetingChats: async (params: {
    clubId: number;
    meetingId: number;
    teamId: number;
    cursorId?: number | null;
  }): Promise<GetMeetingChatsResponseResult> => {
    const { clubId, meetingId, teamId, cursorId } = params;

    const res = await apiClient.get<GetMeetingChatsResponse>(
      CLUBS.meetingTeamChatMessages(clubId, meetingId, teamId),
      {
        params: {
          cursorId: cursorId ?? null,
        },
      }
    );

    return res.result;
  },
};