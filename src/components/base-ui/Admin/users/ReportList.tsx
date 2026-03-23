"use client";

import { useEffect, useState } from "react";
import ReportItem from "./items/AdminReportItem";
import {
  fetchAdminMemberReports,
  type AdminMemberReportItem,
} from "@/lib/api/admin/member";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 닉네임 */
  memberNickname: string;
};

export default function ReportList({ memberNickname }: Props) {
  const [reports, setReports] = useState<AdminMemberReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setIsError(false);

        const res = await fetchAdminMemberReports(memberNickname);
        setReports(res.result.reports ?? []);
      } catch (error) {
        console.error("신고 목록 조회 실패:", error);
        setReports([]);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [memberNickname]);

  // ✅ 로딩 상태
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-Gray-4 text-sm font-medium">
        불러오는 중...
      </div>
    );
  }

  // ✅ 에러 상태
  if (!loading && isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-red-500 text-sm font-medium">
        멤버 신고 목록 불러오기 실패
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="w-full max-w-[1040px] mx-auto flex justify-center items-center py-[80px]">
        <div className="text-Gray-4 text-sm font-medium text-center">
          멤버 신고 목록 없음
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] w-full max-w-[1040px] mx-auto">
      {reports.map((report) => (
        <ReportItem
          key={report.reportId}
          category={report.reportType}
          reporterName={report.reportedMemberNickname}
          content={report.content}
          date={new Date(report.createdAt).toLocaleDateString()}
        />
      ))}
    </div>
  );
}