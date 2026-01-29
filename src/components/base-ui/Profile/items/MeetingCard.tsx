"use client";

import Image from "next/image";

type Props = {
  title: string;
  showMoreIcon?: boolean;
};

export default function MeetingCard({ title, showMoreIcon = false }: Props) {
  return (
    <div
      className={`
        flex w-full items-center justify-between rounded-[8px] bg-white border border-[#EAE5E2]
        
        /* Mobile/Default */
        p-[20px]
        
        /* Tablet (md): h 80px, padding-left 32px, padding-vertical 24px */
        md:h-[80px] md:px-[32px] md:py-[24px]
      `}
    >
      {/* 모임 제목 */}
      <span className="truncate text-[24px] font-semibold leading-[135%] tracking-[-0.024px] text-[#5C5C5C]">
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
