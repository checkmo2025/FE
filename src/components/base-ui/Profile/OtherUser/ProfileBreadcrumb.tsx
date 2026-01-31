import Image from "next/image";
import Link from "next/link";

export default function ProfileBreadcrumb() {
  return (
    <nav
      className="flex w-full flex-col items-start gap-[10px] border-b border-[#DADADA]
      /* 모바일: padding 12px 10px */
      p-[12px_10px]
      /* 데스크탑: padding 12px 10px (기존 유지) */
      md:px-[10px] md:py-[12px]"
    >
      <div className="flex items-center gap-[20px]">
        {/* '전체' 텍스트 */}
        <Link
          href="/"
          className="font-semibold leading-[135%] tracking-[-0.018px] text-[#BBB]
          /* 모바일: 14px */
          text-[14px]
          /* 데스크탑: 18px, font-medium */
          md:text-[18px] md:font-medium"
        >
          전체
        </Link>

        {/* 화살표 아이콘 */}
        <div className="relative h-[12px] w-[12px] md:h-[8px] md:w-[8px]">
          {/* 모바일(rotate-90) / 데스크탑(기본) */}
          <Image
            src="/Polygon6.svg"
            alt="breadcrumb arrow"
            width={12}
            height={12}
            className="rotate-90 md:rotate-0"
          />
        </div>

        {/* 현재 위치 텍스트 */}
        <span
          className="font-semibold leading-[135%] tracking-[-0.018px] text-[#2C2C2C]
          /* 모바일: 14px, 텍스트 '다른 사람 페이지' */
          text-[14px]
          /* 데스크탑: 18px, font-medium, 텍스트 '다른 사람 프로필' */
          md:text-[18px] md:font-medium"
        >
          {/* 모바일 텍스트 */}
          <span className="md:hidden">다른 사람 페이지</span>
          {/* 데스크탑 텍스트 */}
          <span className="hidden md:inline">다른 사람 프로필</span>
        </span>
      </div>
    </nav>
  );
}
