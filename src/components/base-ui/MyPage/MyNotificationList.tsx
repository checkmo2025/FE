"use client";

import React from "react";
import Image from "next/image";

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    content: "‘북적북적’ 모임의 새로운 공지사항이 등록되었습니다.",
    time: "1시간 전",
    isRead: false,
  },
  {
    id: 2,
    content: "‘책 읽는 밤’ 모임 참여 신청이 승인되었습니다.",
    time: "3시간 전",
    isRead: false,
  },
  {
    id: 3,
    content: "작성하신 ‘어린 왕자를 읽고 나서’ 글에 새로운 댓글이 달렸습니다.",
    time: "1일 전",
    isRead: true,
  },
  {
    id: 4,
    content: "‘마음의 양식’ 모임 일정이 변경되었습니다.",
    time: "2일 전",
    isRead: true,
  },
];

const MyNotificationList = () => {
  return (
    <div className="flex flex-col items-start gap-[8px] w-[1048px]">
      {DUMMY_NOTIFICATIONS.map((notification) => (
        <div
          key={notification.id}
          className="flex w-[1048px] p-[28px_20px] justify-between items-center rounded-[8px] bg-white"
        >
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
            {notification.isRead && (
              <div className="w-[24px] h-[24px] shrink-0" />
            )}

            <span className="text-[#5C5C5C] font-sans text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
              {notification.content}
            </span>
          </div>
          <span className="text-[#BBB] font-sans text-[14px] font-normal leading-[145%] tracking-[-0.014px]">
            {notification.time}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MyNotificationList;
