export type TargetType =
  | "MEMBER"
  | "CLUB"
  | "BOOK_STORY"
  | "BOOK_STORY_COMMENT"
  | "CLUB_NOTICE"
  | "CLUB_NOTICE_COMMENT"
  | "CLUB_TOPIC"
  | "CLUB_BOOK_REVIEW"
  | "CHAT";

export type ReportReason =
  | "GENERAL"
  | "INSULT"
  | "INAPPROPRIATE_CONTENT"
  | "SPAM";

export interface CreateReportRequest {
  targetType: TargetType;
  targetId: string; // MEMBER: nickname, other types: string ID
  reason: ReportReason;
  content: string;
}

export interface ReportItem {
  reportId: number;
  targetType: TargetType;
  targetTypeDescription: string;
  targetId: string;
  reason: ReportReason;
  reasonDescription: string;
  content: string;
  redirectUrl: string;
  reportedAt: string;
}

export interface ReportListResponse {
  reports: ReportItem[];
  hasNext: boolean;
  nextCursor: number | null;
}

export interface ReportTarget {
  type: TargetType;
  id: string; // ID or Nickname
  nickname?: string;
  profileImageUrl?: string;
  title?: string;
}

export interface ReportMemberRequest {
  reportedMemberNickname: string;
  reportType: "GENERAL" | "CLUB_MEETING" | "BOOK_STORY" | "COMMENT";
  content: string;
}

export interface ReportMemberResponseResult {
  reportId: number;
}

export interface ReportMemberResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReportMemberResponseResult;
}