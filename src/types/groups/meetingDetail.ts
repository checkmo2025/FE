import { ApiResponse } from "@/lib/api/types";

export type TeamKey = {
  teamId: number;
  teamNumber: number;
};

export type ExistingTeamItem = {
  teamId: number;
  teamNumber: number;
};

export type MeetingMemberInfo = {
  nickname: string;
  profileImageUrl: string | null;
};

export type MeetingTeamMemberItem = {
  clubMemberId: number;
  memberInfo: MeetingMemberInfo;
  teamKey: TeamKey | null;
};

export type MeetingTeamMembersGroup = {
  teamKey: TeamKey;
  members: MeetingTeamMemberItem[];
};

export type GetMeetingDetailResult = {
  meetingId: number;
  title: string;
  meetingTime: string;
  location: string;
  existingTeams: ExistingTeamItem[];
  teamMembers: MeetingTeamMembersGroup[];
  isStaff: boolean;
};

export type GetMeetingDetailResponse = ApiResponse<GetMeetingDetailResult>;
export type GetMeetingDetailResponseResult = GetMeetingDetailResponse["result"];