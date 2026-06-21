import { apiClient } from "@/lib/api/client";
import { MEMBER_ENDPOINTS } from "@/lib/api/endpoints/member";
import { ReportRequest, ReportCreateResponse } from "@/types/report";

export const reportService = {
  /** 신고 생성: POST /reports → 신고 ID 반환 */
  reportMember: async (body: ReportRequest): Promise<number> => {
    const res = await apiClient.post<ReportCreateResponse>(
      MEMBER_ENDPOINTS.REPORT,
      body
    );

    return res.result;
  },
} as const;
