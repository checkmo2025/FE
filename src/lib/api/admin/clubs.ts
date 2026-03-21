import { ADMIN_CLUBS } from "./endpoints/clubs";

export type AdminClubListItem = {
  clubId: number;
  clubName: string;
  ownerEmail: string;
  createdAt: string;
  memberCount: number;
};

export type AdminClubListResult = {
  clubs: AdminClubListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

type AdminClubListResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminClubListResult;
};

export type AdminClubCategory = {
  code: string;
  description: string;
};

export type AdminClubParticipantType = {
  code: string;
  description: string;
};

export type AdminClubLink = {
  link: string;
  label: string;
};

export type AdminClubDetail = {
  clubId: number;
  name: string;
  description: string;
  profileImageUrl: string;
  region: string;
  category: AdminClubCategory[];
  participantTypes: AdminClubParticipantType[];
  links: AdminClubLink[];
  open: boolean;
};

type AdminClubDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminClubDetail;
};

export type AdminClubMemberRole = "OWNER" | "ADMIN" | "MEMBER";

export type AdminClubActiveMember = {
  nickname: string;
  name: string;
  email: string;
  phoneNumber: string;
  joinedAt: string;
  role: AdminClubMemberRole;
};

export type AdminClubActiveMembersResult = {
  members: AdminClubActiveMember[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

type AdminClubActiveMembersResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminClubActiveMembersResult;
};

export async function fetchAdminClubs(
  page = 1,
  size = 20,
  keyword = "",
) {
  const res = await fetch(ADMIN_CLUBS.list(page, size, keyword), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "모임 목록 조회에 실패했습니다.");
  }

  const data: AdminClubListResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message || "모임 목록 조회에 실패했습니다.");
  }

  return data.result;
}

export async function fetchAdminClubDetail(clubId: number) {
  const res = await fetch(ADMIN_CLUBS.detail(clubId), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "모임 상세 조회에 실패했습니다.");
  }

  const data: AdminClubDetailResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message || "모임 상세 조회에 실패했습니다.");
  }

  return data.result;
}

export type UpdateAdminClubRequest = {
  name: string;
  description: string;
  profileImageUrl: string;
  open: boolean;
  region: string;
  category: string[];
  participantTypes: string[];
  links: {
    link: string;
    label: string;
  }[];
};

type UpdateAdminClubResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminClubDetail;
};

export async function updateAdminClub(
  clubId: number,
  body: UpdateAdminClubRequest,
) {
  const res = await fetch(ADMIN_CLUBS.detail(clubId), {
    method: "PUT",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "모임 수정에 실패했습니다.");
  }

  const data: UpdateAdminClubResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message || "모임 수정에 실패했습니다.");
  }

  return data.result;
}

export async function fetchAdminClubActiveMembers(
  clubId: number,
  page = 0,
  size = 20,
) {
  const res = await fetch(ADMIN_CLUBS.activeMembers(clubId, page, size), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "모임 멤버 조회에 실패했습니다.");
  }

  const data: AdminClubActiveMembersResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message || "모임 멤버 조회에 실패했습니다.");
  }

  return data.result;
}