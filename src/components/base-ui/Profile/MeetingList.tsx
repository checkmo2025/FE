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
      className="flex w-full max-w-[1048px] flex-col items-center
      gap-[12px]
      px-[18px] md:px-[40px] lg:px-0 mx-auto
      md:items-start md:gap-[8px]"
    >
      {MOCK_MEETINGS.map((meeting) => (
        <MeetingCard key={meeting.id} title={meeting.title} />
      ))}
    </div>
  );
}
