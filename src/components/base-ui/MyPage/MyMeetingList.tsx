"use client";

import React from "react";
import { DUMMY_MEETINGS } from "@/constants/mocks/mypage";
import MyMeetingCard from "./items/MyMeetingCard";

const MyMeetingList = () => {
  return (
    <div className="flex flex-col items-start gap-[8px] w-[1048px]">
      {DUMMY_MEETINGS.map((meeting) => (
        <MyMeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
};

export default MyMeetingList;
