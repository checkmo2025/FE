import { ReportType } from "@/types/member";

/**
 * 신고 유형 표시 문자열과 API 전송용 타입 간의 매핑 객체
 */
export const REPORT_TYPE_MAP: Record<string, ReportType> = {
  "일반": "GENERAL",
  "책 이야기": "BOOK_STORY",
  "책이야기(댓글)": "COMMENT",
  "책모임 내부": "CLUB_MEETING",
} as const;
