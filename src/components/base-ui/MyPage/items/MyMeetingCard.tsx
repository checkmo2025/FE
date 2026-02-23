"use client";

import React from "react";
import Image from "next/image";
import { MyPageMeeting } from "@/types/mypage";

interface MyMeetingCardProps {
  meeting: MyPageMeeting;
}

const MyMeetingCard = ({ meeting }: MyMeetingCardProps) => {
  return (
    <div className="flex w-full px-[18px] py-[12px] md:p-[20px] justify-between items-center rounded-[8px] bg-white border border-[#EAE5E2] gap-[12px]">
      <span className="text-[#5C5C5C] font-sans text-[16px] md:text-[24px] font-medium md:font-semibold leading-[135%] tracking-[-0.024px] truncate flex-1">
        {meeting.title}
      </span>
      <button type="button" className="flex items-center justify-center shrink-0">
        <Image
          src="/ant-design_more-outlined.svg"
          alt="more"
          width={24}
          height={24}
          className="shrink-0 w-[18px] h-[18px] md:w-[24px] md:h-[24px]"
        />
      </button>
    </div>
  );
};

export default MyMeetingCard;
