import type { ApiResponse } from "@/lib/api/types";

/** 신고 사유 (BE: ReportReason) */
export type ReportReason =
  | "GENERAL" // 일반
  | "INSULT" // 욕설/비방
  | "INAPPROPRIATE_CONTENT" // 음란/부적절
  | "SPAM"; // 홍보/도배

/** 신고 대상 타입 (BE: ReportTargetType) */
export type ReportTargetType =
  | "MEMBER" // 사용자 (targetId = 닉네임)
  | "CLUB" // 독서모임
  | "BOOK_STORY" // 책 이야기
  | "BOOK_STORY_COMMENT" // 책 이야기 댓글
  | "CLUB_NOTICE" // 독서모임 공지사항
  | "CLUB_NOTICE_COMMENT" // 공지사항 댓글
  | "CLUB_TOPIC" // 독서모임 발제
  | "CLUB_BOOK_REVIEW" // 독서모임 한줄평
  | "CHAT"; // 채팅

/**
 * 신고 생성 요청 (POST /reports)
 * - targetId: MEMBER 이면 닉네임, 그 외에는 엔티티 ID 문자열
 * - content: 선택 (최대 500자)
 */
export interface ReportRequest {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  content?: string;
}

/** 생성 응답: 신고 ID */
export type ReportCreateResponse = ApiResponse<number>;

/** 내 신고 목록 항목 (GET /reports/me) */
export interface MyReportInfo {
  reportId: number;
  targetType: ReportTargetType;
  targetTypeDescription: string;
  targetId: string;
  targetSummary: string;
  reason: ReportReason;
  reasonDescription: string;
  content: string;
  redirectUrl: string;
  /** 독서모임/공지는 모임 이름·이미지, 그 외는 작성자 이름·이미지 */
  displayName: string;
  displayImageUrl: string;
  reportedAt: string;
}

export interface MyReportList {
  reports: MyReportInfo[];
  hasNext: boolean;
  nextCursor: number | null;
}

export type MyReportListResponse = ApiResponse<MyReportList>;
