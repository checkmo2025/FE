"use client";

import ReportItem from "./items/AdminReportItem";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 ID */
  userId: string;
};

// TODO: 관리자 사용자 신고 목록 조회 API 연동 후 userId 기반 실제 데이터로 교체 예정
export default function ReportList({ userId }: Props) {
  // 현재는 구조 통일을 위해 props만 받고 사용하지 않음
  void userId;

  const reports = [
    {
      id: 1,
      category: "일반",
      reporterName: "hy_0716",
      content: "부적절한 언어 사용이 있습니다.",
      date: "2025.01.01",
    },
    {
      id: 2,
      category: "욕설",
      reporterName: "user123",
      content: "커뮤니티 가이드 위반입니다.",
      date: "2025.01.02",
    },
  ];

  return (
    <div className="flex flex-col gap-[16px] w-full max-w-[1040px] mx-auto">
      {reports.map((report) => (
        <ReportItem key={report.id} {...report} />
      ))}
    </div>
  );
}