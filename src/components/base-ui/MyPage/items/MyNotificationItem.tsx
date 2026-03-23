"use client";

import React from "react";
import Image from "next/image";
import { NotificationBasicInfo } from "@/types/notification";
import { formatTimeAgo } from "@/utils/time";
import { useReadNotificationMutation } from "@/hooks/mutations/useNotificationMutations";
import { getNotificationText, getNotificationRedirectUrl } from "@/utils/notification";
import { useRouter } from "next/navigation";

interface MyNotificationItemProps {
  notification: NotificationBasicInfo;
}


const MyNotificationItem = ({ notification }: MyNotificationItemProps) => {
  const { mutate: readNotification } = useReadNotificationMutation();
  const router = useRouter();

  const handleClick = () => {
    if (!notification.read) {
      readNotification(notification.notificationId);
    }
    const redirectUrl = getNotificationRedirectUrl(notification);
    router.push(redirectUrl);
  };

  return (
    <div
      onClick={handleClick}
      className="flex w-full p-[12px_20px] md:p-[28px_20px] justify-between items-center rounded-[8px] bg-white border border-[#EAE5E2] gap-[12px] cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-[12px] flex-1 min-w-0">
        {!notification.read && (
          <Image
            src="/icon_alert.svg"
            alt="New"
            width={24}
            priority
            height={24}
            className="shrink-0"
          />
        )}
        {notification.read && <div className="w-[24px] h-[24px] shrink-0" />}

        <span className="text-Gray-5 body_2_3 md:subhead_4_1 truncate flex-1">
          {getNotificationText(notification)}
        </span>
      </div>
      <span className="text-[#BBB] font-sans text-[12px] md:text-[14px] font-normal leading-[145%] tracking-[-0.014px] shrink-0 whitespace-nowrap ml-[8px]">
        {formatTimeAgo(notification.createdAt)}
      </span>
    </div>
  );
};

export default MyNotificationItem;
