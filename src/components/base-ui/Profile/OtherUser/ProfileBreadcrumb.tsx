import Image from "next/image";
import Link from "next/link";

export default function ProfileBreadcrumb() {
  return (
    <nav
      className="flex w-full flex-col items-start gap-[10px] border-b border-Gray-2
      px-[10px] py-[12px]"
    >
      <div className="flex items-center gap-[20px]">
        <Link href="/" className="text-Gray-3 body_1 t:subhead_4_1">
          전체
        </Link>

        <div className="relative h-[12px] w-[12px] t:h-[8px] t:w-[8px]">
          <Image
            src="/Polygon6.svg"
            alt="arrow"
            width={12}
            height={12}
            className="rotate-90 t:rotate-0"
          />
        </div>

        <span className="text-Gray-7 body_1 t:subhead_4_1">
          <span className="t:hidden">다른 사람 페이지</span>
          <span className="hidden t:inline">다른 사람 프로필</span>
        </span>
      </div>
    </nav>
  );
}
