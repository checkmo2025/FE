"use client";

import { useState } from "react";
import MyLibraryList from "@/components/base-ui/MyPage/MyLibraryList";
import MyMeetingList from "@/components/base-ui/MyPage/MyMeetingList";
import BookStoryList from "@/components/base-ui/Profile/BookStoryList";

const TABS = ["책 이야기", "서재", "모임"] as const;
type Tab = (typeof TABS)[number];

export default function OtherUserProfileTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("책 이야기");

  const TAB_CONTENT: Record<Tab, React.ReactNode> = {
    "책 이야기": <BookStoryList />,
    서재: <MyLibraryList />,
    모임: <MyMeetingList />,
  };

  return (
    <div className="flex w-full flex-col items-center gap-[24px] t:gap-[40px]">
      {/* 탭 헤더 */}
      <div className="w-full border-b-2 border-Gray-2">
        <div className="mx-auto flex w-full t:w-[688px] d:w-[1048px]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-[10px] text-center transition-colors
                /* 14px Medium -> body_1_2, 20px Semibold -> subhead_3 */
                body_1_2 t:subhead_3
                ${
                  activeTab === tab
                    ? "border-b-2 border-primary-3 text-primary-3"
                    : "text-Gray-3"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex justify-center w-full px-[18px] t:px-0">
        {TAB_CONTENT[activeTab]}
      </div>
    </div>
  );
}
