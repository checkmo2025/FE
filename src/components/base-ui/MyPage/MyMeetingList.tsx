"use client";

import React from "react";
import Image from "next/image";

const DUMMY_MEETINGS = [
  { id: 1, title: "북적북적" },
  { id: 2, title: "책 읽는 밤" },
  { id: 3, title: "마음의 양식" },
  { id: 4, title: "독서 토론회" },
];

const MyMeetingList = () => {
  return (
    <div className="flex flex-col items-start gap-[8px] w-[1048px]">
      {DUMMY_MEETINGS.map((meeting) => (
        <div
          key={meeting.id}
          className="flex w-[1048px] p-[20px] justify-between items-center rounded-[8px] bg-white"
        >
          <span className="text-[#5C5C5C] font-sans text-[24px] font-semibold leading-[135%] tracking-[-0.024px]">
            {meeting.title}
          </span>
          <button type="button" className="flex items-center justify-center">
            <Image
              src="/ant-design_more-outlined.svg"
              alt="more"
              width={24}
              height={24}
              className="shrink-0"
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyMeetingList;
