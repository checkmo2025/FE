"use client";

import Image from "next/image";

type Props = {
  category: string;
  reporterName: string;
  content: string;
  date: string;
  profileImageUrl?: string;
};

export default function ReportItem({
  category,
  reporterName,
  content,
  date,
  profileImageUrl,
}: Props) {
  return (
    <div
      className="flex items-start rounded-[8px] border border-Subbrown-4 bg-White p-[20px]
      w-full gap-[40px]
      md:w-[440px]
      xl:w-[1000px]"
    >
      {/* 카테고리 뱃지 */}
      <div className="w-[84px] md:w-[110px] shrink-0">
        <div className="flex min-w-[60px] w-fit items-center justify-center gap-[10px] rounded-[4px] bg-Red px-[8px] py-[4px] whitespace-nowrap">
          <span
            className="text-White
            text-[12px] font-medium leading-[145%] tracking-[-0.012px]
            md:body_2_2"
          >
            {category}
          </span>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div
        className="flex flex-col items-start
        w-[199px] gap-[6px]
        md:w-[280px] md:gap-[12px]
        xl:w-auto xl:flex-1"
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-[8px]">
            <div className="relative h-[24px] w-[24px] shrink-0">
              <Image
                src={profileImageUrl || "/profile2.svg"}
                alt={`${reporterName} profile`}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <span className="body_1_2 text-Gray-7">{reporterName}</span>
          </div>
          <span
            className="text-Gray-3
            text-[12px] font-normal leading-[145%] tracking-[-0.012px]
            md:body_2_3"
          >
            {date}
          </span>
        </div>

        <p
          className="text-Gray-5 self-stretch whitespace-pre-wrap
          text-[12px] font-normal leading-[145%] tracking-[-0.012px]
          md:body_2_3"
        >
          {content}
        </p>
      </div>
    </div>
  );
}
