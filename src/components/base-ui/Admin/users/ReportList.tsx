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

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);

        const res = await fetchAdminMemberReports(memberNickname);
        setReports(res.result.reports ?? []);
      } catch (error) {
        console.error("신고 목록 조회 실패:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [memberNickname]);

  if (loading) {
    return (
      <div className="w-full max-w-[1040px] mx-auto">
        <div>불러오는 중...</div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="w-full max-w-[1040px] mx-auto flex justify-center items-center py-[80px]">
        <div className="text-Gray-4 body_1_2">
          신고 내역이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] w-full max-w-[1040px] mx-auto">
      {reports.map((report) => (
        <ReportItem
          key={report.reportId}
          id={report.reportId}
          category={report.reportType}
          reporterName={report.reportedMemberNickname}
          content={report.content}
          date={new Date(report.createdAt).toLocaleDateString()}
        />
      ))}
    </div>
  );
}