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
    keyword,
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