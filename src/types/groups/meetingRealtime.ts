export interface MeetingChatMessageEvent {
  clubId: number;
  meetingId: number;
  teamId: number;
  senderMemberId: string;
  senderNickname: string;
  senderProfileImageUrl: string | null;
  messageId: number;
  content: string;
  sendAt: string;
}

export interface MeetingPresentationEvent {
  clubId: number;
  meetingId: number;
  teamId: number;
  topicId: number;
  isSelected: boolean;
}

export interface MeetingRealtimeErrorBody {
  code: string;
  message: string;
}