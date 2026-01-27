import React from "react";
import Image from "next/image";

const MyPageBreadcrumb = () => {
  return (
    <div className="flex flex-col items-start w-[1396px] px-[10px] py-[12px] gap-[10px] border-b border-[#DADADA]">
      <div className="flex items-center gap-[20px] self-stretch">
        <span className="text-[#BBB] font-sans text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
          전체
        </span>
        <Image
          src="/Polygon6.svg"
          alt="arrow"
          width={20}
          height={20}
          className="w-[20px] h-[20px] rotate-90 fill-[#BBAA9B]"
        />
        <span className="text-[#2C2C2C] font-sans text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
          마이페이지
        </span>
      </div>
    </div>
  );
};

export default MyPageBreadcrumb;
