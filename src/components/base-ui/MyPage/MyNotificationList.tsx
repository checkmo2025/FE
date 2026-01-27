"use client";

import React from "react";
import { DUMMY_NOTIFICATIONS } from "@/constants/mocks/mypage";
import MyNotificationItem from "./items/MyNotificationItem";

const MyNotificationList = () => {
  return (
    <div className="flex flex-col items-start gap-[8px] w-[1048px]">
      {DUMMY_NOTIFICATIONS.map((notification) => (
        <MyNotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default MyNotificationList;
