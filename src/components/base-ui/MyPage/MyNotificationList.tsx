"use client";

import React from "react";
import { DUMMY_NOTIFICATIONS } from "@/constants/mocks/mypage";
import MyNotificationItem from "./items/MyNotificationItem";

const MyNotificationList = () => {
  return (
    <div className="flex flex-col items-start gap-[8px] w-full max-w-[1048px] mx-auto px-[18px] md:px-[40px] lg:px-0">
      {DUMMY_NOTIFICATIONS.map((notification) => (
        <MyNotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default MyNotificationList;
