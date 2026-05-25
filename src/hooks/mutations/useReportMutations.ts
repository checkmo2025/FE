import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";
import { CreateReportRequest } from "@/types/report";
import { reportKeys } from "../queries/useReportQueries";
import { toast } from "react-hot-toast";

export function useCreateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateReportRequest) => reportService.createReport(body),
    onSuccess: () => {
      toast.success("신고가 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: reportKeys.myReports() });
    },
    onError: (error: any) => {
      console.error("Failed to submit report:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "신고에 실패했습니다.";
      toast.error(errorMessage);
    },
  });
}
