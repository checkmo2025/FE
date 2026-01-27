"use client";

import React from "react";
import Image from "next/image";
import { MyPageMeeting } from "@/types/mypage";

interface MyMeetingCardProps {
  meeting: MyPageMeeting;
}

const MyMeetingCard = ({ meeting }: MyMeetingCardProps) => {
  return (
    <div className="flex w-full px-[32px] py-[8px] md:p-[20px] justify-between items-center rounded-[8px] bg-white border border-[#EAE5E2]">
      <span className="text-[#5C5C5C] font-sans text-[18px] md:text-[24px] font-medium md:font-semibold leading-[135%] tracking-[-0.024px]">
        {meeting.title}
      </span>
      <button type="button" className="flex items-center justify-center ">
        <Image
          src="/ant-design_more-outlined.svg"
          alt="more"
          width={24}
          height={24}
          className="shrink-0"
        />
      </button>
    </div>
  );
};

export default MyMeetingCard;
