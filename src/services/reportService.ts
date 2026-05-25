import { apiClient, extractResult } from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/report";
import { ApiResponse } from "@/types/auth";
import { CreateReportRequest, ReportListResponse } from "@/types/report";

export const reportService = {
  createReport: async (body: CreateReportRequest): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(
      REPORT_ENDPOINTS.CREATE,
      body
    );
    return extractResult(res);
  },

  getMyReports: async (cursorId?: number): Promise<ReportListResponse> => {
    const params = cursorId !== undefined ? { cursorId } : undefined;
    const res = await apiClient.get<ApiResponse<ReportListResponse>>(
      REPORT_ENDPOINTS.GET_MY_REPORTS,
      { params }
    );
    return extractResult(res);
  },

  // Backward-compatibility shim for old references (e.g. Admin, Comments)
  reportMember: async (body: any): Promise<number> => {
    const reasonMap: Record<string, any> = {
      GENERAL: "GENERAL",
      ABUSE: "INSULT",
      INSULT: "INSULT",
      COMMENT: "INSULT",
      CLUB_MEETING: "GENERAL",
      INAPPROPRIATE: "INAPPROPRIATE_CONTENT",
      INAPPROPRIATE_CONTENT: "INAPPROPRIATE_CONTENT",
      SPAM: "SPAM"
    };
    return reportService.createReport({
      targetType: body.reportType === "BOOK_STORY" ? "BOOK_STORY" : "MEMBER",
      targetId: body.reportedMemberNickname,
      reason: reasonMap[body.reportType] || "GENERAL",
      content: body.content,
    });
  },
} as const;