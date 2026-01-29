import Image from "next/image";

export default function ProfileBreadcrumb() {
  return (
    // 부모(Page)에 패딩이 있으므로 w-full을 주면 Header 라인과 딱 맞습니다.
    <nav className="flex w-full flex-col items-start gap-[10px] border-b border-[#DADADA] py-[12px] md:px-[10px]">
      <div className="flex items-center gap-[20px]">
        <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#BBB]">
          전체
        </span>

        <Image
          src="/Polygon6.svg"
          alt="breadcrumb arrow"
          width={8}
          height={8}
        />

        <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#2C2C2C]">
          다른 사람 프로필
        </span>
      </div>
    </nav>
  );
}
