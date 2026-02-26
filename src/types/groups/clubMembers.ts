// src/types/groups/clubMembers.ts

export type ClubMemberStatus =
  | "MEMBER"
  | "STAFF"
  | "OWNER"
  | "PENDING"
  | "WITHDRAWN"
  | "KICKED";

export type ClubMemberListStatusFilter = "ALL" | "ACTIVE" | ClubMemberStatus;

/**
 * command: 수행할 명령어
 * - APPROVE: 가입 승인 (PENDING -> MEMBER)
 * - REJECT: 가입 거절 (PENDING 삭제)
 * - CHANGE_ROLE: 회원/운영진 역할 변경 (MEMBER <-> STAFF)
 * - TRANSFER_OWNER: 모임 소유권 이전 (actor: OWNER -> STAFF, target: MEMBER/STAFF -> OWNER)
 * - KICK: 강제 탈퇴 (MEMBER/STAFF -> KICKED)
 */
export type ClubMemberCommand =
  | "APPROVE"
  | "REJECT"
  | "CHANGE_ROLE"
  | "TRANSFER_OWNER"
  | "KICK";

export type ClubMemberDetailInfo = {
  nickname: string;
  profileImageUrl: string | null;
  name: string;
  email: string;
};

export type ClubMemberItem = {
  clubMemberId: number;
  detailInfo: ClubMemberDetailInfo;
  joinMessage: string | null;
  clubMemberStatus: ClubMemberStatus;
  appliedAt: string; // ISO string
  joinedAt: string | null; // ISO string | null
};

export type GetClubMembersParams = {
  clubId: number;
  status: ClubMemberListStatusFilter; // 여기선 ALL만 쓰는 걸 추천
  cursorId?: number | null;
};

export type GetClubMembersResult = {
  clubMembers: ClubMemberItem[];
  hasNext: boolean;
  nextCursor: number | null;
};

/**
 * PATCH /api/clubs/{clubId}/members/{clubMemberId}
 * status: CHANGE_ROLE일 때만 필요, 그 외 command에서는 무시됨
 *
 * ✅ 실수 방지용으로 유니온 타입으로 강제함:
 * - CHANGE_ROLE일 때만 status를 보낼 수 있음
 * - 나머지는 status를 못 붙임(붙이면 TS가 에러)
 */
export type UpdateClubMemberStatusRequest =
  | { command: "APPROVE" }
  | { command: "REJECT" }
  | { command: "KICK" }
  | { command: "TRANSFER_OWNER" }
  | { command: "CHANGE_ROLE"; status: "MEMBER" | "STAFF" };