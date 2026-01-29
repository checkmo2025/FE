import Image from "next/image";

export default function ProfileBreadcrumb() {
  return (
    <nav className="flex w-[1396px] flex-col items-start gap-[10px] border-b border-[#DADADA] px-[10px] py-[12px]">
      <div className="flex items-center gap-[20px] self-stretch">
        <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#BBB]">
          전체
        </span>

        <Image
          src="/Polygon6.svg"
          alt="breadcrumb arrow"
          width={8}
          height={8}
        />

        {/* 요청사항: 닉네임 대신 고정 텍스트 사용 */}
        <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#2C2C2C]">
          다른 사람 프로필
        </span>
      </div>
    </nav>
  );
}
