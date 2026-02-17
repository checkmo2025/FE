"use client";

import React from "react";
import { DUMMY_MEETINGS } from "@/constants/mocks/mypage";
import MyMeetingCard from "./items/MyMeetingCard";

const MyMeetingList = () => {
  return (
    <div className="flex flex-col items-start gap-[8px] w-full max-w-[1048px] px-[18px] md:px-[40px] lg:px-0 mx-auto">
      {DUMMY_MEETINGS.map((meeting) => (
        <MyMeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
};

export default MyMeetingList;
