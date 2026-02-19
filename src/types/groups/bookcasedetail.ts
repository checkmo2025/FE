export type MemberInfo = {
  nickname: string;
  profileImageUrl: string | null;
};

export type TeamMember = {
  // TODO(BE 연동): GET 응답에 clubMemberId가 포함되어야 함.
  clubMemberId: number;
  memberInfo: MemberInfo;
  teamNumber: number | null;
};

export type GetMeetingTeamsResult = {
  existingTeamNumbers: number[];
  members: TeamMember[];
  hasNext: boolean;
  nextCursor: string | null;
};

export type TeamMemberListPutBody = {
  teamMemberList: {
    teamNumber: number;
    clubMemberIds: number[];
  }[];
};

export const MAX_TEAMS = 7;

export function teamLabel(teamNumber: number) {
  // 1 -> A, 2 -> B ...
  const code = 64 + teamNumber;
  if (code < 65 || code > 90) return `${teamNumber}`;
  return String.fromCharCode(code);
}

export function normalizeTeams(input: number[]) {
  // 팀 번호가 이상하게 들어와도 1..N 형태로 정규화
  const uniqueSorted = Array.from(new Set(input))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);

  if (uniqueSorted.length === 0) return [1];
  // 1..N이 아닐 수도 있으니 갯수만큼 1..len
  return uniqueSorted.map((_, idx) => idx + 1);
}
