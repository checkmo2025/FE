import { ADMIN_STORIES } from "./endpoints/stories";
import type { CommentInfo } from "@/types/story";

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

const ADMIN_LIST_PAGE_SIZE = 20;
const BOOK_STORY_API_PAGE_SIZE = 12;

async function fetchAdminBookStoryPage(page: number, keyword: string) {
  const res = await fetch(ADMIN_STORIES.list(page, keyword), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`책 이야기 목록 조회 실패: ${res.status} ${text}`);
  }

  const data: AdminBookStoryListResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message || "책 이야기 목록 조회에 실패했습니다.");
  }

  return data.result;
}

export async function fetchAdminBookStories(page = 1, keyword = "") {
  const safePage = Math.max(1, page);
  const firstItemIndex = (safePage - 1) * ADMIN_LIST_PAGE_SIZE;
  const firstApiPage =
    Math.floor(firstItemIndex / BOOK_STORY_API_PAGE_SIZE) + 1;
  const lastApiPage =
    Math.floor(
      (firstItemIndex + ADMIN_LIST_PAGE_SIZE - 1) /
        BOOK_STORY_API_PAGE_SIZE
    ) + 1;
  const apiPages = Array.from(
    { length: lastApiPage - firstApiPage + 1 },
    (_, index) => firstApiPage + index
  );
  const results = await Promise.all(
    apiPages.map((apiPage) => fetchAdminBookStoryPage(apiPage, keyword))
  );
  const firstResult = results[0];
  const totalElements = firstResult.totalElements ?? 0;
  const sliceStart =
    firstItemIndex - (firstApiPage - 1) * BOOK_STORY_API_PAGE_SIZE;
  const basicInfoList = results
    .flatMap((result) => result.basicInfoList ?? [])
    .slice(sliceStart, sliceStart + ADMIN_LIST_PAGE_SIZE);
  const totalPages = Math.max(
    1,
    Math.ceil(totalElements / ADMIN_LIST_PAGE_SIZE)
  );

  return {
    ...firstResult,
    basicInfoList,
    page: safePage,
    pageSize: ADMIN_LIST_PAGE_SIZE,
    totalPages,
    hasNext: safePage < totalPages,
  };
}

export type AdminBookStoryDetail = {
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
  viewCount: number;
  commentCount: number;
  comments: CommentInfo[];
  prevBookStoryId: number;
  nextBookStoryId: number;
};

type AdminBookStoryDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminBookStoryDetail;
};

export async function fetchAdminBookStoryDetail(bookStoryId: number) {
  const res = await fetch(ADMIN_STORIES.detail(bookStoryId), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`책 이야기 상세 조회 실패: ${res.status} ${text}`);
  }

  const data: AdminBookStoryDetailResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message || "책 이야기 상세 조회에 실패했습니다.");
  }

  return data.result;
}

type DeleteAdminBookStoryResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
};

export async function deleteAdminBookStory(bookStoryId: number) {
  const res = await fetch(ADMIN_STORIES.delete(bookStoryId), {
    method: "DELETE",
    credentials: "include",
  });

  const data: DeleteAdminBookStoryResponse = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new Error(data.message || "책 이야기 삭제에 실패했습니다.");
  }

  return data.result;
}

type DeleteAdminCommentResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: number;
};

export async function deleteAdminComment(
  bookStoryId: number,
  commentId: number
) {
  const res = await fetch(
    ADMIN_STORIES.deleteComment(bookStoryId, commentId),
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data: DeleteAdminCommentResponse = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new Error(data.message || "댓글 삭제에 실패했습니다.");
  }

  return data.result;
}
