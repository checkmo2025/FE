import { apiClient } from "@/lib/api/client";
import { CLUBS_BOOKSHELF_ENDPOINTS } from "@/lib/api/endpoints/ClubsBookshelf";
import { ApiResponse } from "@/lib/api/types";
import type {
  BookshelfDetailResponse,
  BookshelfDetailResponseResult,
  TopicsResponse,
  TopicsResponseResult,
  UpsertTopicRequest,
  UpsertTopicResponse,
  ReviewsResponse,
  ReviewsResponseResult,
  UpsertReviewRequest,
  UpsertReviewResponse,
  DeleteTopicResponse,
  DeleteReviewResponse,
  BookshelfEditGetResult,
  BookshelfEditGetResponse,
  CreateBookshelfRequest,
  CreateBookshelfResult,
  BooksSearchResponse,
  SearchBooksParams,
  ClubsBookshelfSimpleResponse,
  ClubsBookshelfSimpleResult,
  BookshelfPatchRequest,
  BookshelfPatchResult,
  BookshelfPatchResponse,
  DeleteBookshelfResponse,
} from "@/types/bookshelf";


export const clubsBookshelfService = {
  getSimpleBookshelves: async (params: {
    clubId: number;
    cursorId?: number;
  }): Promise<ClubsBookshelfSimpleResult> => {
    const { clubId, cursorId } = params;

    const res = await apiClient.get<ClubsBookshelfSimpleResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.simpleBookshelves(clubId),
      { params: { cursorId } }
    );

    return res.result;
  },

  searchBooks: async (params: SearchBooksParams): Promise<BooksSearchResponse> => {
    const keyword = params.keyword?.trim();
    const page = params.page ?? 0;

    if (!keyword) throw new Error("keyword is required");

    const res = await apiClient.get<ApiResponse<BooksSearchResponse>>(
      CLUBS_BOOKSHELF_ENDPOINTS.SEARCH_BOOKS,
      { params: { keyword, page } }
    );

    return res.result;
  },

  createBookshelf: async (args: {
    clubId: number;
    body: CreateBookshelfRequest;
  }): Promise<CreateBookshelfResult> => {
    const res = await apiClient.post<ApiResponse<CreateBookshelfResult>>(
      CLUBS_BOOKSHELF_ENDPOINTS.CREATE_BOOKSHELF(args.clubId),
      args.body
    );

    return res.result;
  },

  // GET /api/clubs/{clubId}/bookshelves/{meetingId}/edit
  getEdit: async (
    clubId: number,
    meetingId: number
  ): Promise<BookshelfEditGetResult> => {
    const res = await apiClient.get<BookshelfEditGetResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.editGet(clubId, meetingId)
    );
    return res.result;
  },

  // PATCH /api/clubs/{clubId}/bookshelves/{meetingId}
  patch: async (
    clubId: number,
    meetingId: number,
    payload: BookshelfPatchRequest
  ): Promise<BookshelfPatchResult> => {
    const res = await apiClient.patch<BookshelfPatchResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.patch(clubId, meetingId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.result;
  },

   // GET /api/clubs/{clubId}/bookshelves/{meetingId}
  getBookshelfDetail: async (params: {
    clubId: number;
    meetingId: number;
  }): Promise<BookshelfDetailResponseResult> => {
    const { clubId, meetingId } = params;

    const res = await apiClient.get<BookshelfDetailResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.detail(clubId, meetingId)
    );

    return res.result;
  },
  
  deleteBookshelf: async (params: {
    clubId: number;
    meetingId: number;
  }): Promise<string> => {
    const { clubId, meetingId } = params;

    const res = await apiClient.delete<DeleteBookshelfResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.delete(clubId, meetingId) // 또는 detail/patch 경로 재사용
    );

    return res.result;
  },

  // GET /api/clubs/{clubId}/bookshelves/{meetingId}/topics?cursorId=...
  getTopics: async (params: {
    clubId: number;
    meetingId: number;
    cursorId?: number | null;
  }): Promise<TopicsResponseResult> => {
    const { clubId, meetingId, cursorId } = params;

    const res = await apiClient.get<TopicsResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.topics(clubId, meetingId),
      { params: { cursorId: cursorId ?? null } }
    );

    return res.result;
  },

  // POST /api/clubs/{clubId}/bookshelves/{meetingId}/topics
  createTopic: async (params: {
    clubId: number;
    meetingId: number;
    body: UpsertTopicRequest;
  }): Promise<string> => {
    const { clubId, meetingId, body } = params;

    const res = await apiClient.post<UpsertTopicResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.topics(clubId, meetingId),
      body
    );

    return res.result;
  },

  // PATCH /api/clubs/{clubId}/bookshelves/{meetingId}/topics/{topicId}
  updateTopic: async (params: {
    clubId: number;
    meetingId: number;
    topicId: number;
    body: UpsertTopicRequest;
  }): Promise<string> => {
    const { clubId, meetingId, topicId, body } = params;

    const res = await apiClient.patch<UpsertTopicResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.topic(clubId, meetingId, topicId),
      body
    );

    return res.result;
  },

  // DELETE /api/clubs/{clubId}/bookshelves/{meetingId}/topics/{topicId}
  deleteTopic: async (params: {
    clubId: number;
    meetingId: number;
    topicId: number;
  }): Promise<string> => {
    const { clubId, meetingId, topicId } = params;

    const res = await apiClient.delete<DeleteTopicResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.topic(clubId, meetingId, topicId)
    );

    return res.result;
  },

  // GET /api/clubs/{clubId}/bookshelves/{meetingId}/reviews?cursorId=...
  getReviews: async (params: {
    clubId: number;
    meetingId: number;
    cursorId?: number | null;
  }): Promise<ReviewsResponseResult> => {
    const { clubId, meetingId, cursorId } = params;

    const res = await apiClient.get<ReviewsResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.reviews(clubId, meetingId),
      { params: { cursorId: cursorId ?? null } }
    );

    return res.result;
  },

  // POST /api/clubs/{clubId}/bookshelves/{meetingId}/reviews
  createReview: async (params: {
    clubId: number;
    meetingId: number;
    body: UpsertReviewRequest;
  }): Promise<string> => {
    const { clubId, meetingId, body } = params;

    const res = await apiClient.post<UpsertReviewResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.reviews(clubId, meetingId),
      body
    );

    return res.result;
  },

  // PATCH /api/clubs/{clubId}/bookshelves/{meetingId}/reviews/{reviewId}
  updateReview: async (params: {
    clubId: number;
    meetingId: number;
    reviewId: number;
    body: UpsertReviewRequest;
  }): Promise<string> => {
    const { clubId, meetingId, reviewId, body } = params;

    const res = await apiClient.patch<UpsertReviewResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.review(clubId, meetingId, reviewId),
      body
    );

    return res.result;
  },

  // DELETE /api/clubs/{clubId}/bookshelves/{meetingId}/reviews/{reviewId}
  deleteReview: async (params: {
    clubId: number;
    meetingId: number;
    reviewId: number;
  }): Promise<string> => {
    const { clubId, meetingId, reviewId } = params;

    const res = await apiClient.delete<DeleteReviewResponse>(
      CLUBS_BOOKSHELF_ENDPOINTS.review(clubId, meetingId, reviewId)
    );

    return res.result;
  },
};