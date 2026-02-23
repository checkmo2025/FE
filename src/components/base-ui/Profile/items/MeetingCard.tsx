"use client";

import Image from "next/image";

type Props = {
  title: string;
  showMoreIcon?: boolean;
};

export default function MeetingCard({ title, showMoreIcon = false }: Props) {
  return (
    <div
      className="flex w-full items-center justify-between rounded-[8px] bg-white border border-[#EAE5E2] px-[18px] py-[12px] md:p-[20px] gap-[12px]"
    >
      {/* 모임 제목 */}
      <span className="truncate text-[16px] md:text-[24px] font-medium md:font-semibold leading-[135%] tracking-[-0.024px] text-[#5C5C5C] flex-1">
        {title}
      </span>

      {/* showMoreIcon이 true일 경우에만 렌더링 */}
      {showMoreIcon && (
        <button type="button" className="relative h-[24px] w-[24px] shrink-0">
          <Image
            src="/ant-design_more-outlined.svg"
            alt="더보기"
            fill
            className="object-contain"
          />
        </button>
      )}
    </div>
  );
}
