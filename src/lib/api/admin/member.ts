import { ADMIN_MEMBER_ENDPOINTS } from "./endpoints/member";

export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type MemberEmailsResult = {
  emails: string[];
};

export type MemberEmailsResponse = ApiResponse<MemberEmailsResult>;

export async function fetchMemberEmails(
  keyword: string,
  limit = 20
): Promise<MemberEmailsResponse> {
  const params = new URLSearchParams({
    keyword: keyword.trim(),
    limit: String(limit),
  });

  const res = await fetch(
    `${ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_EMAILS}?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`회원 이메일 검색 실패 (${res.status})`);
  }

  return res.json();
}

export type AdminMemberListItem = {
  memberId: string;
  nickname: string;
  name: string;
  email: string;
  phoneNumber: string;
};

export type AdminMemberListResult = {
  memberList: AdminMemberListItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
};

export type AdminMemberListResponse = ApiResponse<AdminMemberListResult>;

export async function fetchAdminMembers(
  page = 1,
  keyword = ""
): Promise<AdminMemberListResponse> {
  const trimmedKeyword = keyword.trim();

  const params = new URLSearchParams({
    page: String(page),
  });

  if (trimmedKeyword) {
    params.append("keyword", trimmedKeyword);
  }

  const res = await fetch(
    `${ADMIN_MEMBER_ENDPOINTS.GET_MEMBERS}?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`회원 목록 조회 실패 (${res.status})`);
  }

  return res.json();
}

export type AdminMemberDetailResult = {
  memberId: string;
  nickname: string;
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  profileImageUrl: string;
  categories: string[];
  active: boolean;
};

export type AdminMemberDetailResponse = ApiResponse<AdminMemberDetailResult>;

export async function fetchAdminMemberDetail(
  memberNickName: string
): Promise<AdminMemberDetailResponse> {
  const encodedNickname = encodeURIComponent(memberNickName);

  const res = await fetch(
    ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_DETAIL(encodedNickname),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`회원 상세 조회 실패 (${res.status})`);
  }

  return res.json();
}

export type AdminMemberReportItem = {
  reportId: number;
  reportedMemberNickname: string;
  reportedMemberProfileImageUrl: string;
  reportType: string;
  content: string;
  createdAt: string;
};

export type AdminMemberReportsResult = {
  reports: AdminMemberReportItem[];
};

export type AdminMemberReportsResponse = ApiResponse<AdminMemberReportsResult>;

export async function fetchAdminMemberReports(
  memberNickName: string
): Promise<AdminMemberReportsResponse> {
  const encodedNickname = encodeURIComponent(memberNickName);

  const res = await fetch(
    ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_REPORTS(encodedNickname),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`회원 신고 목록 조회 실패 (${res.status})`);
  }

  return res.json();
}

export type AdminMemberClubItem = {
  clubId: number;
  clubName: string;
};

export type AdminMemberClubsResult = {
  clubList: AdminMemberClubItem[];
};

export type AdminMemberClubsResponse = ApiResponse<AdminMemberClubsResult>;

export async function fetchAdminMemberClubs(
  memberNickname: string
): Promise<AdminMemberClubsResponse> {
  const encodedNickname = encodeURIComponent(memberNickname);

  const res = await fetch(
    ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_CLUBS(encodedNickname),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`회원 가입 모임 조회 실패 (${res.status})`);
  }

  return res.json();
}

export type AdminMemberBookStoryItem = {
  bookStoryId: number;
  bookInfo: {
    bookId: string;
    title: string;
    author: string;
    imgUrl: string;
  };
  authorInfo: {
    nickname: string;
    profileImageUrl: string;
    following: boolean;
  };
  bookStoryTitle: string;
  description: string;
  likes: number;
  likedByMe: boolean;
  createdAt: string;
  writtenByMe: boolean;
  commentCount: number;
  viewCount: number;
};

export type AdminMemberBookStoriesResult = {
  basicInfoList: AdminMemberBookStoryItem[];
  hasNext: boolean;
  nextCursor: number | null;
  pageSize: number;
};

export type AdminMemberBookStoriesResponse =
  ApiResponse<AdminMemberBookStoriesResult>;

export async function fetchAdminMemberBookStories(
  memberNickname: string,
  cursorId?: number | null
): Promise<AdminMemberBookStoriesResponse> {
  const encodedNickname = encodeURIComponent(memberNickname);
  const params = new URLSearchParams();

  if (cursorId !== undefined && cursorId !== null) {
    params.append("cursorId", String(cursorId));
  }

  const query = params.toString();
  const url = query
    ? `${ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_BOOK_STORIES(encodedNickname)}?${query}`
    : ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_BOOK_STORIES(encodedNickname);

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`회원 책이야기 조회 실패 (${res.status})`);
  }

  return res.json();
}

export type AdminMemberNewsItem = {
  newsId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  carousel: string;
  publishStartAt: string;
};

export type AdminMemberNewsResult = {
  basicInfoList: AdminMemberNewsItem[];
  hasNext: boolean;
  nextCursor: number | null;
  pageSize: number;
};

export type AdminMemberNewsResponse = ApiResponse<AdminMemberNewsResult>;

export async function fetchAdminMemberNews(
  memberNickname: string,
  cursorId?: number | null
): Promise<AdminMemberNewsResponse> {
  const encodedNickname = encodeURIComponent(memberNickname);
  const params = new URLSearchParams();

  if (cursorId !== undefined && cursorId !== null) {
    params.append("cursorId", String(cursorId));
  }

  const query = params.toString();
  const url = query
    ? `${ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_NEWS(encodedNickname)}?${query}`
    : ADMIN_MEMBER_ENDPOINTS.GET_MEMBER_NEWS(encodedNickname);

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`회원 등록 소식 조회 실패 (${res.status})`);
  }

  return res.json();
}