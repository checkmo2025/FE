"use client";

import Link from "next/link";

type Props = {
  label: string;
  href: string;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

export default function SettingsMenuItem({
  label,
  href,
  isActive,
  onClick,
}: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        /* [수정 1] group 클래스 추가: 자식 요소에서 group-hover 사용 가능 */
        group 
        flex w-full items-center gap-[10px] rounded-[8px] px-[20px] py-[8px] transition-all duration-200
        
        /* [수정 2] 하드코딩 색상 -> 테마 변수 */
        ${
          isActive
            ? "bg-Subbrown-3" // 기존 bg-[#D2C5B6]
            : "bg-transparent hover:bg-Gray-1" // 기존 hover:bg-[#F2F2F2] (Gray_1이 #EEEEEE로 유사함)
        }
      `}
    >
      <span
        className={`
          body_1_2
          /* [수정 3] 텍스트 색상 테마 변수 적용 */
          ${
            isActive
              ? "text-Gray-6" // 기존 text-[#434343]
              : "text-Gray-4 group-hover:text-Gray-6" // 기존 text-[#8D8D8D]
          }
        `}
      >
        {label}
      </span>
    </Link>
  );
}
