import type { ApiResponse } from "@/lib/api/types";
import type { ExistingTeamItem } from "@/types/groups/meetingDetail";

export interface MeetingTopicAuthorInfo {
  nickname: string;
  profileImageUrl: string | null;
}

export interface MeetingTopicItem {
  topicId: number;
  content: string;
  createdAt: string;
  author: MeetingTopicAuthorInfo;
  isSelected: boolean;
}

export interface GetMeetingTopicsResult {
  existingTeams: ExistingTeamItem[];
  requestedTeam: ExistingTeamItem;
  topics: MeetingTopicItem[];
}

export type GetMeetingTopicsResponse = ApiResponse<GetMeetingTopicsResult>;
export type GetMeetingTopicsResponseResult = GetMeetingTopicsResponse["result"];