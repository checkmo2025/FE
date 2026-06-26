import { useMutation } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";
import { ReportRequest } from "@/types/report";

export function useReportMemberMutation() {
  return useMutation({
    mutationFn: (body: ReportRequest) => reportService.reportMember(body),
  });
}