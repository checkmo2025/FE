// src/components/base-ui/Settings/SettingsMenuItem.tsx
"use client";

import Link from "next/link";

type Props = {
  label: string;
  href: string;
  isActive: boolean;
};

export default function SettingsMenuItem({ label, href, isActive }: Props) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-[10px] px-[20px] py-[8px] transition-all duration-200
        
        /* 기본 레이아웃: width 236px */
        w-[236px] self-stretch border-radius-[8px] rounded-[8px]
        
        /* 1. 선택 시 스타일: 배경 Subbrown_3(#D2C5B6) */
        /* 2. 호버 시 스타일: 선택되지 않았을 때만 연한 회색 배경 적용 */
        ${isActive ? "bg-[#D2C5B6]" : "bg-transparent hover:bg-[#F2F2F2]"}
      `}
    >
      <span
        className={`
          text-[14px] font-medium leading-[145%] tracking-[-0.014px]
          
          /* 1. 선택 시 텍스트 색상: Gray_6(#434343) */
          /* 2. 기본/호버 텍스트 색상: Gray_4(#8D8D8D) -> 호버 시 Gray_6(#434343) */
          ${
            isActive
              ? "text-[#434343]"
              : "text-[#8D8D8D] group-hover:text-[#434343]"
          }
        `}
      >
        {label}
      </span>
    </Link>
  );
}
