import type { ApiResponse } from "@/lib/api/types";

export interface MeetingChatSenderInfo {
  nickname: string;
  profileImageUrl: string | null;
}

export interface MeetingChatMessageItem {
  sender: MeetingChatSenderInfo;
  messageId: number;
  content: string;
  sendAt: string;
}

export interface GetMeetingChatsResult {
  chats: MeetingChatMessageItem[];
  hasNext: boolean;
  nextCursor: number | null;
}

export type GetMeetingChatsResponse = ApiResponse<GetMeetingChatsResult>;
export type GetMeetingChatsResponseResult = GetMeetingChatsResponse["result"];