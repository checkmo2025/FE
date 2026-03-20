"use client";

import React, { useState, Suspense } from "react";
import MyPageBreadcrumb from "@/components/base-ui/MyPage/ProfileSection/MyPageBreadcrumb";
import UserProfile from "@/components/base-ui/MyPage/ProfileSection/UserProfile";
import MyPageTabs from "@/components/base-ui/MyPage/ProfileSection/MyPageTabs";
import MyBookStoryList from "@/components/base-ui/MyPage/Lists/MyBookStoryList";
import MyMeetingList from "@/components/base-ui/MyPage/Lists/MyMeetingList";
import MyNotificationList from "@/components/base-ui/MyPage/Lists/MyNotificationList";
import MyLibraryList from "@/components/base-ui/Profile/Lists/LibraryList";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useSearchParams } from "next/navigation";

function MyPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const initialTab = ["stories", "library", "meetings", "notifications"].includes(tabParam || "")
    ? (tabParam as string)
    : "stories";

  const [activeTab, setActiveTab] = useState(initialTab);
  const { isInitialized, isLoggedIn } = useAuthGuard();

  if (!isInitialized || !isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-[10px] md:gap-[24px] w-full min-h-screen bg-[#F9F7F6] pb-[100px]">
      <MyPageBreadcrumb />
      <div className="mt-[12px] md:mt-[56px]">
        <UserProfile />
      </div>
      <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 gap-[24px] mt-[10px] md:mt-[72px]">
        <MyPageTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "stories" && <MyBookStoryList />}
        {activeTab === "library" && <MyLibraryList />}
        {activeTab === "meetings" && <MyMeetingList />}
        {activeTab === "notifications" && <MyNotificationList />}
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense fallback={null}>
      <MyPageContent />
    </Suspense>
  );
}
