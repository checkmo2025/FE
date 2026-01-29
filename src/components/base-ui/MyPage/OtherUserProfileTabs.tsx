// src/components/base-ui/MyPage/OtherUserProfileTabs.tsx
"use client";

import { useState } from "react";
import MyLibraryList from "./MyLibraryList";
import MyMeetingList from "./MyMeetingList";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";

const TABS = ["책 이야기", "서재", "모임"] as const;
type Tab = (typeof TABS)[number];

export default function OtherUserProfileTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("책 이야기");

  return (
    <div className="flex flex-col items-center gap-[40px] w-full">
      {/* ===== 탭 메뉴 ===== */}
      <div className="w-full border-b-2 border-[#DADADA]">
        <div className="mx-auto flex w-[1440px] px-[197px]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-[10px] text-center text-[20px] font-semibold
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

      {/* ===== 콘텐츠 ===== */}
      {activeTab === "책 이야기" && (
        <div className="flex gap-[20px] w-[1048px]">
          <BookStoryCard
            authorName="hy"
            createdAt={new Date().toISOString()}
            viewCount={10}
            title="책 이야기 제목"
            content="책 이야기 내용입니다."
          />
        </div>
      )}

      {activeTab === "서재" && <MyLibraryList />}

      {activeTab === "모임" && <MyMeetingList />}
    </div>
  );
}
