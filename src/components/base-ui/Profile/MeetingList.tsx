"use client";

import MeetingCard from "@/components/base-ui/Profile/items/MeetingCard";
import React from "react";

// Mock Data
const MOCK_MEETINGS = [
  { id: 1, title: "북적북적" },
  { id: 2, title: "고요한 밤의 독서" },
  { id: 3, title: "SF 소설 마니아" },
  { id: 4, title: "주말 아침 필사 모임" },
];

export default function MeetingList() {
  return (
    <div
      className="flex w-full flex-col items-center 
      /* 모바일: 세로 간격 12px (BookStoryList와 통일) */
      gap-[12px]
      
      /* 태블릿/데스크탑: 좌측 정렬, 간격 8px */
      md:w-[688px] md:items-start md:gap-[8px] 
      xl:w-[1048px]"
    >
      {MOCK_MEETINGS.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          title={meeting.title}
          // showMoreIcon={false}
        />
      ))}
    </div>
  );
}
