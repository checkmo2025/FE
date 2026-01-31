"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  backUrl?: string;
};

export default function MobileSettingHeader({
  title,
  backUrl = "/setting",
}: Props) {
  return (
    // md:hidden -> 태블릿 이상에서는 숨김
    <div className="flex w-full flex-col items-start gap-[10px] border-b border-Gray-2 p-[12px_10px] md:hidden">
      <Link href={backUrl} className="flex items-center gap-[8px] self-stretch">
        {/* 뒤로가기 아이콘 (Polygon 6) */}
        <div className="relative h-[12px] w-[12px] rotate-[-90deg]">
          {/* public/Polygon6.svg 가 있다고 가정하거나 SVG 직접 구현 */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 12L0 0H12L6 12Z" fill="#BBAA9B" />
          </svg>
        </div>

        {/* 뒤로가기 텍스트 (명세상 텍스트가 '뒤로가기'가 아니라 타이틀일 수도 있으나, 명세 텍스트 '뒤로가기' 따름) */}
        {/* 혹은 title props를 보여줄 수도 있음. 명세에는 "뒤로가기" 텍스트 스타일이 정의됨 */}
        <span className="text-[14px] font-semibold leading-[145%] tracking-[-0.014px] text-Gray-7">
          {title}
        </span>
      </Link>
    </div>
  );
}
