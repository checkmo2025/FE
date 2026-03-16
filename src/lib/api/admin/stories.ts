import { ADMIN_STORIES } from "./endpoints/stories";

export type AdminBookStoryItem = {
  bookStoryId: number;
  bookStoryTitle: string;
  authorEmail: string;
  authorNickname: string;
  bookTitle: string;
  createdAt: string;
};

export type AdminBookStoryListResult = {
  basicInfoList: AdminBookStoryItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
};

type AdminBookStoryListResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminBookStoryListResult;
};

export async function fetchAdminBookStories(page = 0, size = 10) {
  const res = await fetch(ADMIN_STORIES.list(page, size), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`책 이야기 목록 조회 실패: ${res.status} ${text}`);
  }

  const data: AdminBookStoryListResponse = await res.json();
  return data.result;
}