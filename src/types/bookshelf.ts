import { ApiResponse } from "@/lib/api/types";


export interface MeetingInfo {
  meetingId: number;
  generation: number;
  tag: string;
  averageRate: number;
}

export interface BookInfo {
  bookId: string;
  title: string;
  author: string;
  imgUrl: string;
}

export interface BookShelfInfoItem {
  meetingInfo: MeetingInfo;
  bookInfo: BookInfo;
}

export interface ClubsBookshelfSimpleResult {
  bookShelfInfoList: BookShelfInfoItem[];
  hasNext: boolean;
  nextCursor: number | null;
  isStaff: boolean;
}

export type ClubsBookshelfSimpleResponse = ApiResponse<ClubsBookshelfSimpleResult>;


export type BooksSearchItem = {
  isbn: string;
  title: string;
  author: string;
  imgUrl: string;
  publisher: string;
  description: string;
  link: string;
};

export type BooksSearchResponse = {
  detailInfoList: BooksSearchItem[];
  hasNext: boolean;
  currentPage: number;
};

export type SearchBooksParams = {
  keyword: string; // 필수
  page?: number;   // 무한스크롤
};

export type CreateBookshelfRequest = {
  title: string;
  meetingTime: string; // ISO String
  location: string;
  generation: number;
  tag: string;
  bookInfo: {
    isbn: string;
    title: string;
    author: string;
    imgUrl: string;
    publisher: string;
    description: string;
  };
};

export type CreateBookshelfResult = string;

export type BookshelfTag = string;

export type BookshelfEditGetResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    meetingInfo: {
      meetingId: number;
      title: string;
      meetingTime: string; // ISO
      location: string;
      generation: number;
      tag: BookshelfTag;
    };
    bookDetailInfo: {
      bookId: string;
      title: string;
      author: string;
      imgUrl: string;
      publisher: string;
      description: string;
    };
  };
};

export type BookshelfEditGetResult = BookshelfEditGetResponse["result"];

export type BookshelfPatchRequest = {
  title: string;
  meetingTime: string; // ISO
  location: string;
  generation: number;
  tag: BookshelfTag;
};

// PATCH 응답이 뭐로 오는지 스펙을 안 줘서, "일단 result만 반환" 원칙에 맞춰 최소 안전 타입 처리
export type BookshelfPatchResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: unknown;
};

export type BookshelfPatchResult = BookshelfPatchResponse["result"];