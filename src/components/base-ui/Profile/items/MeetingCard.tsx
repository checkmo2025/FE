"use client";

import Image from "next/image";

type Props = {
  title: string;
  showMoreIcon?: boolean;
  onClick?: () => void;
};

export default function MeetingCard({ title, showMoreIcon = false, onClick }: Props) {
  const content = (
    <>
      {/* 모임 제목 */}
      <span className="truncate text-[16px] md:text-[24px] font-medium md:font-semibold leading-[135%] tracking-[-0.024px] text-[#5C5C5C] flex-1">
        {title}
      </span>

      {/* showMoreIcon이 true일 경우에만 렌더링 */}
      {showMoreIcon && (
        <span className="relative h-[24px] w-[24px] shrink-0">
          <Image
            src="/ant-design_more-outlined.svg"
            alt=""
            fill
            className="object-contain"
          />
        </span>
      )}
    </>
  );

  const cardClassName =
    "flex w-full items-center justify-between rounded-[8px] bg-white border border-[#EAE5E2] px-[18px] py-[12px] md:p-[20px] gap-[12px]";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${title} 모임 방문하기`}
        className={`${cardClassName} cursor-pointer text-left transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-2`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cardClassName}>
      {content}
    </div>
  );
}
