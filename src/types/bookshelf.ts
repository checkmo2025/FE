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

// ===== 책장 상세,삭제(발제/한줄평/정기모임 공통) =====

export interface BookshelfDetailMeetingInfo {
  meetingId: number;
  generation: number;
  tag: string;
  averageRate: number;
}

export interface BookshelfDetailBookInfo {
  bookId: string;
  title: string;
  author: string;
  imgUrl: string;
  publisher: string;
  description: string;
}

export interface BookshelfDetailResult {
  meetingInfo: BookshelfDetailMeetingInfo;
  bookDetailInfo: BookshelfDetailBookInfo;
}

export type BookshelfDetailResponse = ApiResponse<BookshelfDetailResult>;
export type BookshelfDetailResponseResult = BookshelfDetailResponse["result"];

export type DeleteBookshelfResponse = ApiResponse<string>;
export type DeleteBookshelfResponseResult = DeleteBookshelfResponse["result"];



// ===== 발제(topics) =====

export interface TopicAuthorInfo {
  nickname: string;
  profileImageUrl: string;
}

export interface TopicDetailItem {
  topicId: number;
  content: string;
  authorInfo: TopicAuthorInfo;
  isAuthor: boolean;
}

export interface TopicsResult {
  topicDetailList: TopicDetailItem[];
  hasNext: boolean;
  nextCursor: number | null;
}

export type TopicsResponse = ApiResponse<TopicsResult>;
export type TopicsResponseResult = TopicsResponse["result"];

// create/update 요청 바디 (스웨거: description)
export interface UpsertTopicRequest {
  description: string;
}

// create/update/delete 응답: result가 "string"으로 내려옴(현재 스펙 그대로)
export type UpsertTopicResponse = ApiResponse<string>;
export type UpsertTopicResponseResult = UpsertTopicResponse["result"];

export type DeleteTopicResponse = ApiResponse<string>;
export type DeleteTopicResponseResult = DeleteTopicResponse["result"];

// ===== 한줄평(reviews) =====

export interface BookReviewDetailItem {
  bookReviewId: number;
  description: string;
  rate: number;
  authorInfo: TopicAuthorInfo; // 구조 동일해서 재사용
  isAuthor: boolean;
}

export interface ReviewsResult {
  bookReviewDetailList: BookReviewDetailItem[];
  hasNext: boolean;
  nextCursor: number | null;
}

export type ReviewsResponse = ApiResponse<ReviewsResult>;
export type ReviewsResponseResult = ReviewsResponse["result"];

export interface UpsertReviewRequest {
  description: string;
  rate: number;
}

export type UpsertReviewResponse = ApiResponse<string>;
export type UpsertReviewResponseResult = UpsertReviewResponse["result"];

export type DeleteReviewResponse = ApiResponse<string>;
export type DeleteReviewResponseResult = DeleteReviewResponse["result"];