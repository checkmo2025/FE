"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import ReportItem from "./items/AdminReportItem";
import {
  fetchAdminMemberReports,
  type AdminMemberReportItem,
} from "@/lib/api/admin/member";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 닉네임 */
  memberNickname: string;
};

const mergeReports = (
  current: AdminMemberReportItem[],
  incoming: AdminMemberReportItem[]
) => {
  const reportsById = new Map(
    current.map((report) => [report.reportId, report])
  );

  incoming.forEach((report) => reportsById.set(report.reportId, report));
  return Array.from(reportsById.values());
};

const formatReportedAt = (reportedAt: string) => {
  const date = new Date(reportedAt);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function ReportList({ memberNickname }: Props) {
  const [reports, setReports] = useState<AdminMemberReportItem[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isNextPageError, setIsNextPageError] = useState(false);
  const [initialRetryCount, setInitialRetryCount] = useState(0);
  const fetchingNextPageRef = useRef(false);

  const { ref, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        setIsError(false);
        setIsNextPageError(false);
        setReports([]);
        setHasNext(false);
        setNextCursor(null);
        fetchingNextPageRef.current = false;

        const res = await fetchAdminMemberReports(memberNickname, null);

        if (!active) return;

        setReports(res.result.reports ?? []);
        setHasNext(res.result.hasNext ?? false);
        setNextCursor(res.result.nextCursor ?? null);
      } catch (error) {
        if (!active) return;

        console.error("신고 목록 조회 실패:", error);
        setReports([]);
        setHasNext(false);
        setNextCursor(null);
        setIsError(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      active = false;
    };
  }, [memberNickname, initialRetryCount]);

  useEffect(() => {
    if (
      !inView ||
      !hasNext ||
      nextCursor === null ||
      fetchingNextPageRef.current
    ) {
      return;
    }

    let active = true;

    const loadMoreReports = async () => {
      fetchingNextPageRef.current = true;

      try {
        setIsFetchingNextPage(true);
        setIsNextPageError(false);

        const res = await fetchAdminMemberReports(memberNickname, nextCursor);

        if (!active) return;

        setReports((current) =>
          mergeReports(current, res.result.reports ?? [])
        );
        setHasNext(res.result.hasNext ?? false);
        setNextCursor(res.result.nextCursor ?? null);
      } catch (error) {
        if (!active) return;

        console.error("신고 목록 추가 조회 실패:", error);
        setIsNextPageError(true);
      } finally {
        fetchingNextPageRef.current = false;

        if (active) {
          setIsFetchingNextPage(false);
        }
      }
    };

    loadMoreReports();

    return () => {
      active = false;
    };
  }, [
    inView,
    hasNext,
    nextCursor,
    memberNickname,
  ]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-Gray-4 text-sm font-medium">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-[12px] py-10 w-full text-sm font-medium">
        <p className="text-red-500">신고 목록을 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => setInitialRetryCount((count) => count + 1)}
          className="rounded-[6px] border border-Subbrown-4 px-[16px] py-[8px] text-Gray-6 hover:bg-Subbrown-5"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="w-full max-w-[1040px] mx-auto flex justify-center items-center py-[80px]">
        <div className="text-Gray-4 text-sm font-medium text-center">
          작성한 신고가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-[16px] w-full max-w-[1040px] mx-auto">
      <div className="flex flex-col gap-[16px] w-full">
        {reports.map((report) => (
          <ReportItem
            key={report.reportId}
            reason={report.reasonDescription}
            content={report.content?.trim() || "입력된 신고 내용 없음"}
            targetLabel={report.targetLabel}
            targetUrl={report.targetUrl}
            targetAvailable={report.targetAvailable}
            reportedAt={formatReportedAt(report.reportedAt)}
          />
        ))}
      </div>

      {hasNext && !isNextPageError && <div ref={ref} className="h-4 w-full" />}

      {isFetchingNextPage && (
        <p className="py-4 text-center text-Gray-4">
          추가 신고를 불러오는 중...
        </p>
      )}

      {isNextPageError && (
        <div className="flex flex-col items-center gap-[8px] py-4 text-sm">
          <p className="text-red-500">추가 신고를 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => setIsNextPageError(false)}
            className="rounded-[6px] border border-Subbrown-4 px-[16px] py-[8px] text-Gray-6 hover:bg-Subbrown-5"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
}
