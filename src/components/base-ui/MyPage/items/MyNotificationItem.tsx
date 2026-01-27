"use client";

import React from "react";
import Image from "next/image";
import { MyPageNotification } from "@/types/mypage";

interface MyNotificationItemProps {
  notification: MyPageNotification;
}

const MyNotificationItem = ({ notification }: MyNotificationItemProps) => {
  return (
    <div className="flex w-[1048px] p-[28px_20px] justify-between items-center rounded-[8px] bg-white">
      <div className="flex items-center gap-[12px]">
        {!notification.isRead && (
          <Image
            src="/icon_alert.svg"
            alt="New"
            width={24}
            priority
            height={24}
            className="shrink-0"
          />
        )}
        {notification.isRead && <div className="w-[24px] h-[24px] shrink-0" />}

        <span className="text-[#5C5C5C] font-sans text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
          {notification.content}
        </span>
      </div>
      <span className="text-[#BBB] font-sans text-[14px] font-normal leading-[145%] tracking-[-0.014px]">
        {notification.time}
      </span>
    </div>
  );
};

export default MyNotificationItem;
