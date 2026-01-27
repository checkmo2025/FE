"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import MyPageBreadcrumb from "@/components/base-ui/MyPage/MyPageBreadcrumb";
import UserProfile from "@/components/base-ui/MyPage/UserProfile";
import MyPageTabs from "@/components/base-ui/MyPage/MyPageTabs";
import MyBookStoryList from "@/components/base-ui/MyPage/MyBookStoryList";
import MyLibraryList from "@/components/base-ui/MyPage/MyLibraryList";
import MyMeetingList from "@/components/base-ui/MyPage/MyMeetingList";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("stories");

  return (
    <div className="flex flex-col items-center gap-[24px] w-full min-h-screen bg-white pb-[100px]">
      <Header />
      <MyPageBreadcrumb />

      {/* Profile Section (Breadcrumb 아래 80px 간격은 UserProfile 내부 gap으로 처리됨을 가정하거나 여기서 margin으로 처리) */}
      {/* 디자인 스펙상 Breadcrumb 아래 80px 간격이 Outer Wrapper의 gap으로 명시되어 있으므로, 
          UserProfile 내부의 gap-[80px]이 그 역할을 하거나, 여기서 mt를 줄 수 있음.
          현재 UserProfile이 w-[1440px] 컨테이너 역할을 하므로, 상단 여백을 추가함. */}
      <div className="mt-[56px]">
        {/* 80px - 24px(global gap) = 56px 보정 */}
        <UserProfile />
      </div>
      {/* Tab Navigation & Content Area */}
      {/* UserProfile width is 1440px (wrapper) / 734px (inner). 
          We want the tabs to align with the main content width, likely 1440px or constrained container.
          Assuming 1440px max-width for consistency with Header. */}
      <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 gap-[24px] mt-[72px]">
        <MyPageTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "stories" && <MyBookStoryList />}
        {activeTab === "library" && <MyLibraryList />}
        {activeTab === "meetings" && <MyMeetingList />}
        {activeTab === "notifications" && (
          <div className="w-[1048px] h-[300px] flex justify-center items-center text-gray-400">
            준비 중인 기능입니다.
          </div>
        )}
      </div>
    </div>
  );
}
