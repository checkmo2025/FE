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
        flex items-center gap-[10px] px-[20px] py-[8px] rounded-[8px] transition-all duration-200
        
        /* [수정] 고정 너비(w-[236px]) 제거 -> 부모 너비에 맞춤(w-full) */
        w-full
        
        /* 배경색 로직 */
        ${
          isActive
            ? "bg-Subbrown-3" // #D2C5B6
            : "bg-transparent hover:bg-Gray-1"
        }
      `}
    >
      <span
        className={`
          /* 폰트 스타일: Body_1.2 (14px, 500) */
          body_1_2
          
          /* 텍스트 색상 로직 */
          ${
            isActive
              ? "text-Gray-6" // #434343
              : "text-Gray-4 hover:text-Gray-6" // #8D8D8D
          }a
        `}
      >
        {label}
      </span>
    </Link>
  );
}
