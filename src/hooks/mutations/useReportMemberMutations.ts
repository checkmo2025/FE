import { useMutation } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";
import { ReportMemberRequest } from "@/types/report";

export function useReportMemberMutation() {
  return useMutation({
    mutationFn: (body: ReportMemberRequest) => reportService.reportMember(body),
  });
}