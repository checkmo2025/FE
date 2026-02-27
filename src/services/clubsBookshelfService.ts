import { apiClient } from "@/lib/api/client";
import { CLUBS_BOOKSHELF_ENDPOINTS } from "@/lib/api/endpoints/ClubsBookshelf";
import { ApiResponse } from "@/lib/api/types";
import { BookshelfEditGetResponse, BookshelfEditGetResult, BookshelfPatchRequest, BookshelfPatchResponse, BookshelfPatchResult, BooksSearchResponse, ClubsBookshelfSimpleResponse, ClubsBookshelfSimpleResult, CreateBookshelfRequest, CreateBookshelfResult, SearchBooksParams } from "@/types/bookshelf";


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
};