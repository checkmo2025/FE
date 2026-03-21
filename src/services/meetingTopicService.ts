import { apiClient } from "@/lib/api/client";
import { CLUBS } from "@/lib/api/endpoints/Clubs";
import type {
  GetMeetingTopicsResponse,
  GetMeetingTopicsResponseResult,
} from "@/types/groups/meetingTopics";

export const meetingTopicService = {
  getMeetingTopics: async (params: {
    clubId: number;
    meetingId: number;
    teamId: number;
  }): Promise<GetMeetingTopicsResponseResult> => {
    const { clubId, meetingId, teamId } = params;

    const res = await apiClient.get<GetMeetingTopicsResponse>(
      CLUBS.meetingTeamTopics(clubId, meetingId, teamId)
    );

    return res.result;
  },
};