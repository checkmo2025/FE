"use client";

import React, { useState } from "react";
import ProfileUserInfo from "@/components/base-ui/Profile/OtherUser/ProfileUserInfo";
import BookStoryList from "@/components/base-ui/Profile/Lists/BookStoryList";
import LibraryList from "@/components/base-ui/Profile/Lists/LibraryList";
import MeetingList from "@/components/base-ui/Profile/Lists/MeetingList";
import ProfileBreadcrumb from "@/components/base-ui/Profile/OtherUser/ProfileBreadcrumb";
import OtherUserProfileTabs from "@/components/base-ui/Profile/OtherUser/OtherUserProfileTabs";
import type { OtherProfileTabId } from "@/components/base-ui/Profile/OtherUser/OtherUserProfileTabs";

type PageProps = {
  params: Promise<{ nickname: string }>;
};

export default function OtherUserProfilePage({ params }: PageProps) {
  return <OtherUserProfileContent params={params} />;
}

function OtherUserProfileContent({ params }: PageProps) {
  const { nickname } = React.use(params);
  const decodedNickname = nickname ? decodeURIComponent(nickname) : "";
  const [activeTab, setActiveTab] = useState<OtherProfileTabId>("stories");

  return (
    <div className="flex flex-col items-center gap-[10px] md:gap-[24px] w-full min-h-screen bg-[#F9F7F6] pb-[100px]">
      <ProfileBreadcrumb nickname={decodedNickname} />

      <div className="mt-[12px] md:mt-[56px]">
        <ProfileUserInfo nickname={nickname} />
      </div>

      <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 gap-[24px] mt-[10px] md:mt-[72px]">
        <OtherUserProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "stories" && <BookStoryList nickname={nickname} />}
        {activeTab === "library" && <LibraryList nickname={nickname} />}
        {activeTab === "meetings" && <MeetingList nickname={nickname} />}
      </div>
    </div>
  );
}
