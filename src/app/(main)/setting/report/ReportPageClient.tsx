"use client";

import ReportItem from "@/components/base-ui/Settings/Report/ReportItem";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useMyReportsQuery } from "@/hooks/queries/useReportQueries";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function ReportPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useMyReportsQuery();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <SettingsDetailLayout title="신고 관리" mode="wide" className="gap-[8px]">
        <div className="flex h-[200px] w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-2"></div>
        </div>
      </SettingsDetailLayout>
    );
  }

  if (isError) {
    return (
      <SettingsDetailLayout title="신고 관리" mode="wide" className="gap-[8px]">
        <div className="flex h-[200px] w-full items-center justify-center text-Gray-5">
          신고 목록을 불러오는 데 실패했습니다.
        </div>
      </SettingsDetailLayout>
    );
  }

  const reports = data?.pages.flatMap((page) => page.reports) ?? [];

  return (
    <SettingsDetailLayout title="신고 관리" mode="wide" className="gap-[8px]">
      {reports.length === 0 ? (
        <div className="flex h-[200px] w-full items-center justify-center text-Gray-5">
          신고 내역이 없습니다.
        </div>
      ) : (
        reports.map((report, idx) => (
          <ReportItem
            key={`${report.reportId}-${idx}`}
            category={report.targetTypeDescription || "일반"}
            reporterName={report.targetId}
            content={report.content}
            date={report.reportedAt.substring(0, 10).replace(/-/g, ".")}
            profileImageUrl={undefined}
            redirectUrl={report.redirectUrl}
          />
        ))
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-4 w-full" />
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary-2"></div>
        </div>
      )}
    </SettingsDetailLayout>
  );
}
