"use client";

import React from "react";
import Image from "next/image";
import { MyPageNotification } from "@/types/mypage";

interface MyNotificationItemProps {
  notification: MyPageNotification;
}

const MyNotificationItem = ({ notification }: MyNotificationItemProps) => {
  return (
    <div className="flex w-full p-[12px_20px] md:p-[28px_20px] justify-between items-center rounded-[8px] bg-white border border-[#EAE5E2] gap-[12px]">
      <div className="flex items-center gap-[12px] flex-1 min-w-0">
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

        <span className="text-Gray-5 body_2_3 md:subhead_4_1 truncate flex-1">
          {notification.content}
        </span>
      </div>
      <span className="text-[#BBB] font-sans text-[12px] md:text-[14px] font-normal leading-[145%] tracking-[-0.014px] shrink-0 whitespace-nowrap ml-[8px]">
        {notification.time}
      </span>
    </div>
  );
};

export default MyNotificationItem;
