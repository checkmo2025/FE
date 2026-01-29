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
    // Responsive Layout Container
    // Tablet(md): w-[688px]
    // Desktop(xl): w-[1048px]
    <div className="flex w-full flex-col items-start gap-[8px] md:w-[688px] xl:w-[1048px]">
      {MOCK_MEETINGS.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          title={meeting.title}
          // showMoreIcon={false} // 기본값이 false이므로 생략 가능
        />
      ))}
    </div>
  );
}
