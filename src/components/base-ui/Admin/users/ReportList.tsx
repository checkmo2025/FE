"use client";

import ReportItem from "./items/AdminReportItem";

export default function ReportList() {
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