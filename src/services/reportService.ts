import { apiClient } from "@/lib/api/client";
import { MEMBER_ENDPOINTS } from "@/lib/api/endpoints/member";
import {
  ReportMemberRequest,
  ReportMemberResponse,
  ReportMemberResponseResult,
} from "@/types/report";

export const reportService = {
  reportMember: async (
    body: ReportMemberRequest
  ): Promise<ReportMemberResponseResult> => {
    const res = await apiClient.post<ReportMemberResponse>(
      MEMBER_ENDPOINTS.REPORT,
      body
    );

    return res.result;
  },
} as const;