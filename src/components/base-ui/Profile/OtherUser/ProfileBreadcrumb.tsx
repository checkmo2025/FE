import React from "react";
import Image from "next/image";

const MyPageBreadcrumb = () => {
  return (
    <div className="flex flex-col items-start w-full max-w-[1440px] px-[18px] md:px-[40px] lg:px-[20px] py-[12px] gap-[10px] border-b border-[#DADADA] mx-auto">
      <div className="flex items-center gap-[20px] self-stretch">
        <span className="text-[#BBB] font-sans text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
          전체
        </span>
        <Image
          src="/Polygon6.svg"
          alt="arrow"
          width={12}
          height={12}
          className="shrink-0"
        />
        <span className="text-[#2C2C2C] font-sans text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
          다른 사람 페이지
        </span>
      </div>
    </div>
  );
};

export default MyPageBreadcrumb;
