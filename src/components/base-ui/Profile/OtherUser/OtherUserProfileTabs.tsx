// src/components/base-ui/MyPage/OtherUserProfileTabs.tsx
"use client";

import { useState } from "react";
import MyLibraryList from "@/components/base-ui/MyPage/MyLibraryList";
import MyMeetingList from "@/components/base-ui/MyPage/MyMeetingList";
import BookStoryList from "@/components/base-ui/Profile/BookStoryList";

const TABS = ["책 이야기", "서재", "모임"] as const;
type Tab = (typeof TABS)[number];

export default function OtherUserProfileTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("책 이야기");

  return (
    <div className="flex w-full flex-col items-center gap-[40px]">
      {/* ===== 탭 메뉴 ===== */}
      <div className="w-full border-b-2 border-[#DADADA]">
        <div className="mx-auto flex w-[1440px] px-[197px]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-[10px] text-center text-[20px] font-semibold ${
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

      {/* 책 이야기 리스트 */}
      {activeTab === "책 이야기" && <BookStoryList />}

      {/* 서재 리스트 */}
      {activeTab === "서재" && <MyLibraryList />}

      {/* 모임 리스트 */}
      {activeTab === "모임" && <MyMeetingList />}
    </div>
  );
}
