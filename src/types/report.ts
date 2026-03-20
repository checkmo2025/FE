import type { ApiResponse } from "@/lib/api/types";

export type ReportType = "GENERAL" | "BOOK_STORY";

export interface ReportMemberRequest {
  reportedMemberNickname: string;
  reportType: ReportType;
  content: string;
}

export type ReportMemberResponse = ApiResponse<string>;
export type ReportMemberResponseResult = ReportMemberResponse["result"];