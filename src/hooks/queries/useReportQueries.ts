import { useInfiniteQuery } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";

export const reportKeys = {
  all: ["reports"] as const,
  myReports: () => [...reportKeys.all, "me"] as const,
};

export const useMyReportsQuery = (enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: reportKeys.myReports(),
    queryFn: ({ pageParam }) => reportService.getMyReports(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined),
    enabled,
  });
};
