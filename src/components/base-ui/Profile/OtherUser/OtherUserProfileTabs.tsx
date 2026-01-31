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
    <div className="flex w-full flex-col items-center gap-[24px] md:gap-[40px]">
      {/* ===== 탭 메뉴 ===== */}
      <div className="w-full border-b-2 border-[#DADADA]">
        <div className="mx-auto flex w-full md:w-[688px] xl:w-[1048px]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-[10px] text-center font-medium md:font-semibold transition-colors
                text-[14px] md:text-[20px]
                ${
                  activeTab === tab
                    ? "border-b-2 border-[#5E4A40] text-[#5E4A40]"
                    : "text-[#BBB]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 콘텐츠 영역 ===== */}
      <div
        className="flex justify-center w-full 
        /* 모바일: 양옆 패딩 18px 적용 (여기서 339px 영역 확보) */
        px-[18px] 
        /* 데스크탑: 패딩 0 (부모 너비 688px/1048px 따름) */
        md:px-0"
      >
        {TAB_CONTENT[activeTab]}
      </div>
    </div>
  );
}
