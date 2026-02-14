'use client';

import Image from 'next/image';

type SettingReportListProps = {
  badgeText: string; // 예: "일반"
  reporterName: string; // 예: "hy_0716"
  reportedAt: string; // 예: "2025.01.01"
  content: string; // 신고 내용

  className?: string;
};

export default function Setting_ReportList({
  badgeText,
  reporterName,
  reportedAt,
  content,
  className = '',
}: SettingReportListProps) {
  return (
    <div
      className={`
        flex w-[1000px] p-[20px] items-start gap-[40px]
        rounded-[8px] border border-[color:var(--Subbrown_4,#EAE5E2)]
        bg-[color:var(--White,#FFF)]
        ${className}
      `}
    >
      <div
        className="
          flex w-[60px] px-[4px] py-[4px]
          justify-center items-center gap-[10px] shrink-0
          rounded-[4px]
          bg-[color:var(--red,#FF5151)]
        "
      >
        <p className="text-[color:var(--White,#FFF)] body_2_2 whitespace-nowrap">
          {badgeText}
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="flex items-center gap-[8px] min-w-0">
            <Image src="/profile5.svg" alt="" width={24} height={24} />
            <p className="text-[color:var(--Gray_7,#2C2C2C)] body_1_2 truncate">
              {reporterName}
            </p>
          </div>

          <p className="text-[color:var(--Gray_3,#BBB)] body_2_3 shrink-0">
            {reportedAt}
          </p>
        </div>

        <div className="h-[12px]" />

        <p className="text-[color:var(--Gray_5,#5C5C5C)] body_2_3 whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
}
