import { GetMeetingTeamsResult } from "@/types/groups/bookcasedetail";


export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export const MEETING_TEAMS_DUMMY: ApiResponse<GetMeetingTeamsResult> = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공입니다.",
  result: {
    existingTeamNumbers: [1, 2],
    members: [
      {
        clubMemberId: 9,
        memberInfo: { nickname: "문학러버", profileImageUrl: null },
        teamNumber: null,
      },
      {
        clubMemberId: 8,
        memberInfo: { nickname: "독서광5", profileImageUrl: null },
        teamNumber: null,
      },
      {
        clubMemberId: 2,
        memberInfo: { nickname: "테스터2", profileImageUrl: null },
        teamNumber: null,
      },
      {
        clubMemberId: 1,
        memberInfo: { nickname: "테스터1", profileImageUrl: null },
        teamNumber: 1,
      },
    ],
    hasNext: false,
    nextCursor: null,
  },
};

// 더미 fetch처럼 쓰려고 약간의 딜레이를 줌.
export async function fetchMeetingTeamsDummy() {
  await new Promise((r) => setTimeout(r, 150));
  return MEETING_TEAMS_DUMMY;
}
