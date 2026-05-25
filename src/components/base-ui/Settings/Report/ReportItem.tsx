"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

type Props = {
  category: string;
  reporterName: string;
  content: string;
  date: string;
  profileImageUrl?: string;
  redirectUrl?: string;
};

export default function ReportItem({
  category,
  reporterName,
  content,
  date,
  profileImageUrl,
  redirectUrl,
}: Props) {
  return (
    <div
      className="box-sizing-border-box flex flex-row items-start p-[20px] gap-[40px] bg-White border border-[#EAE5E2] rounded-[8px]
      w-full h-auto
      xl:w-[1000px] xl:h-auto"
    >
      {/* 왼쪽 컬럼: 카테고리 뱃지 및 이동하기 버튼 */}
      <div className="flex flex-col items-start gap-[12px] w-[110px] shrink-0">
        {/* 신고_카테고리 뱃지 (레드) */}
        <div className="flex items-center justify-center rounded-[4px] bg-[#FF5151] w-fit px-[8px] min-w-[60px] h-[25px] whitespace-nowrap">
          <span className="text-White text-[12px] font-medium leading-[145%] tracking-[-0.001em] font-sans">
            {category}
          </span>
        </div>

        {/* 이동하기 버튼 뱃지 (Subbrown_2) */}
        {redirectUrl ? (
          <Link
            href={redirectUrl}
            className="flex items-center justify-center rounded-[4px] bg-[#BBAA9B] hover:bg-[#A99889] transition-all duration-200 w-fit px-[8px] min-w-[60px] h-[25px] whitespace-nowrap cursor-pointer"
          >
            <span className="text-White text-[12px] font-medium leading-[145%] tracking-[-0.001em] font-sans">
              이동하기
            </span>
          </Link>
        ) : (
          <div className="flex items-center justify-center rounded-[4px] bg-[#EAE5E2] w-fit px-[8px] min-w-[60px] h-[25px] whitespace-nowrap opacity-60">
            <span className="text-Gray-4 text-[12px] font-medium leading-[145%] tracking-[-0.001em] font-sans">
              이동불가
            </span>
          </div>
        )}
      </div>

      {/* Frame 2087328557: Content Area */}
      <div className="flex flex-col items-start gap-[12px] flex-1">
        {/* Frame 2087328556: Header Block */}
        <div className="flex flex-row justify-between items-start w-full h-[24px]">
          {/* Frame 2087328555: Profile Block */}
          <div className="flex flex-row items-center gap-[8px] h-[24px]">
            {/* Frame 2087327667: Profile Picture Frame */}
            <div className="relative h-[24px] w-[24px] rounded-full overflow-hidden border border-[#BBBBBB] bg-White shrink-0">
              <Image
                src={profileImageUrl || DEFAULT_PROFILE_IMAGE}
                alt={`${reporterName} profile`}
                fill
                className="object-cover"
              />
            </div>
            {/* hy_0716: Nickname */}
            <span className="text-[#2C2C2C] text-[14px] font-medium leading-[145%] tracking-[-0.001em] font-sans truncate max-w-[120px] md:max-w-[200px]">
              {reporterName}
            </span>
          </div>

          {/* 2025.01.01: Date */}
          <span className="text-[#BBBBBB] text-[12px] font-normal leading-[145%] tracking-[-0.001em] font-sans shrink-0">
            {date}
          </span>
        </div>

        {/* Report Content Text Block */}
        <p className="text-[#5C5C5C] text-[12px] font-normal leading-[145%] tracking-[-0.001em] font-sans self-stretch line-clamp-3 md:line-clamp-2 xl:line-clamp-2 text-left">
          {content}
        </p>
      </div>
    </div>
  );
}
