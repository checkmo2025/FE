import type { ApiResponse } from "@/lib/api/types";

export type ClubNoticeTagCode = "GENERAL" | "MEETING" | "VOTE" | "VOTE_MEETING";

export interface ClubNoticeTagItem {
  code: ClubNoticeTagCode;
  description: string;
}

export interface ClubNoticeItem {
  id: number;
  title: string;
  tagItem: ClubNoticeTagItem;
  createdAt: string; // ISO
  isPinned: boolean;
}

export interface ClubNoticePageResult {
  notices: ClubNoticeItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/** GET /clubs/{clubId}/notices result */
export interface GetClubNoticesResult {
  pinnedNotices: ClubNoticeItem[];
  normalNotices: ClubNoticePageResult;
}

export type GetClubNoticesResponse = ApiResponse<GetClubNoticesResult>;
export type GetClubNoticesResponseResult = GetClubNoticesResponse["result"];

/** POST /clubs/{clubId}/notices body.vote */
export interface CreateClubNoticeVote {
  title: string;
  content: string;
  item1?: string;
  item2?: string;
  item3?: string;
  item4?: string;
  item5?: string;
  item6?: string;
  anonymity: boolean;
  duplication: boolean;
  startTime: string; // ISO
  deadline: string; // ISO
}

/** POST /clubs/{clubId}/notices body */
export interface CreateClubNoticeRequest {
  title: string;
  content: string;
  meetingId?: number;
  imageUrls?: string[];
  vote?: CreateClubNoticeVote;
  isPinned: boolean;
}

export type CreateClubNoticeResponse = ApiResponse<string>;
export type CreateClubNoticeResponseResult = CreateClubNoticeResponse["result"];

/** -------------------- Notice Detail -------------------- */

export interface ClubNoticeDetailTag {
  code: ClubNoticeTagCode;
  description: string;
}

export interface ClubNoticeDetailBookInfo {
  bookId: string;
  title: string;
  author: string;
  imgUrl: string;
}

export interface ClubNoticeMeetingDetail {
  meetingId: number;
  title: string;
  meetingTime: string; // ISO
  location: string;
  generation: number;
  tag: string;
  content: string | null;
  bookInfo: ClubNoticeDetailBookInfo;
}

export interface ClubNoticeVoteMember {
  nickname: string;
  profileImageUrl: string | null;
}

export interface ClubNoticeVoteItem {
  itemNumber: number;
  item: string;
  voteCount: number;
  votedMembers: ClubNoticeVoteMember[];
  isSelected: boolean;
}

export interface ClubNoticeVoteDetail {
  id: number; // voteId
  title: string;
  content: string;
  anonymity: boolean;
  duplication: boolean;
  startTime: string; // ISO
  deadline: string; // ISO
  items: ClubNoticeVoteItem[];
}

export interface GetClubNoticeDetailResult {
  id: number;
  title: string;
  content: string;
  tag: ClubNoticeDetailTag;
  imageUrls: string[];
  createdAt: string; // ISO
  meetingDetail?: ClubNoticeMeetingDetail | null;
  voteDetail?: ClubNoticeVoteDetail | null;
  isPinned: boolean;
}

export type GetClubNoticeDetailResponse = ApiResponse<GetClubNoticeDetailResult>;
export type GetClubNoticeDetailResponseResult = GetClubNoticeDetailResponse["result"];

/** -------------------- Notice Update -------------------- */

export interface UpdateClubNoticeVoteRequest {
  deadline: string; // ISO
}

export interface UpdateClubNoticeRequest {
  title: string;
  content: string;
  meetingId: number | null;
  imageUrls: string[];
  vote?: UpdateClubNoticeVoteRequest;
  isPinned: boolean;
}

export type UpdateClubNoticeResponse = ApiResponse<string>;
export type UpdateClubNoticeResponseResult = UpdateClubNoticeResponse["result"];

/** -------------------- Notice Delete -------------------- */

export type DeleteClubNoticeResponse = ApiResponse<string>;
export type DeleteClubNoticeResponseResult = DeleteClubNoticeResponse["result"];

/** -------------------- Vote Submit -------------------- */

export interface VoteClubNoticeRequest {
  selectedItemNumbers: number[];
}

export type VoteClubNoticeResponse = ApiResponse<string>;
export type VoteClubNoticeResponseResult = VoteClubNoticeResponse["result"];

/** -------------------- Notice Comments -------------------- */

export interface ClubNoticeCommentAuthorInfo {
  nickname: string;
  profileImageUrl: string;
}

export interface ClubNoticeCommentItem {
  commentId: number;
  authorInfo: ClubNoticeCommentAuthorInfo;
  content: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface GetClubNoticeCommentsResult {
  comments: ClubNoticeCommentItem[];
  hasNext: boolean;
  nextCursor: number;
}

export type GetClubNoticeCommentsResponse = ApiResponse<GetClubNoticeCommentsResult>;
export type GetClubNoticeCommentsResponseResult =
  GetClubNoticeCommentsResponse["result"];

export interface CreateClubNoticeCommentRequest {
  content: string;
}

export type CreateClubNoticeCommentResponse = ApiResponse<string>;
export type CreateClubNoticeCommentResponseResult =
  CreateClubNoticeCommentResponse["result"];

export interface UpdateClubNoticeCommentRequest {
  content: string;
}

export type UpdateClubNoticeCommentResponse = ApiResponse<string>;
export type UpdateClubNoticeCommentResponseResult =
  UpdateClubNoticeCommentResponse["result"];

export type DeleteClubNoticeCommentResponse = ApiResponse<string>;
export type DeleteClubNoticeCommentResponseResult =
  DeleteClubNoticeCommentResponse["result"];