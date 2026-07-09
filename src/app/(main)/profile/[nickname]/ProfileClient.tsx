"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import ProfileUserInfo from "@/components/base-ui/Profile/OtherUser/ProfileUserInfo";
import BookStoryList from "@/components/base-ui/Profile/Lists/BookStoryList";
import LibraryList from "@/components/base-ui/Profile/Lists/LibraryList";
import MeetingList from "@/components/base-ui/Profile/Lists/MeetingList";
import ProfileBreadcrumb from "@/components/base-ui/Profile/OtherUser/ProfileBreadcrumb";
import OtherUserProfileTabs from "@/components/base-ui/Profile/OtherUser/OtherUserProfileTabs";
import type { OtherProfileTabId } from "@/components/base-ui/Profile/OtherUser/OtherUserProfileTabs";
import { useOtherProfileQuery } from "@/hooks/queries/useMemberQueries";
import { getProfileAccessErrorMessage } from "@/utils/profileAccess";

const TAB_UNAVAILABLE_TARGET: Record<OtherProfileTabId, string> = {
  stories: "책 이야기를",
  library: "서재를",
  meetings: "모임을",
};

function ProfileTabUnavailableMessage({
  activeTab,
  profileMessage,
}: {
  activeTab: OtherProfileTabId;
  profileMessage: string;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-Gray-5 body_1_2 md:subhead_4_1">{profileMessage}</p>
      <p className="text-Gray-4 body_2_3 md:body_1_2">
        프로필을 조회할 수 없어 {TAB_UNAVAILABLE_TARGET[activeTab]} 불러올 수 없습니다.
      </p>
    </div>
  );
}

function ProfileTabLoadingMessage() {
  return (
    <div className="flex justify-center items-center py-16 w-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
    </div>
  );
}

export default function ProfileClient({ encodedNickname }: { encodedNickname: string }) {
  const nickname = encodedNickname ? decodeURIComponent(encodedNickname) : "";
  const [activeTab, setActiveTab] = useState<OtherProfileTabId>("stories");
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const profileQuery = useOtherProfileQuery(nickname);
  const profileAccessErrorMessage = getProfileAccessErrorMessage(profileQuery.error);
  const profileTabErrorMessage =
    profileAccessErrorMessage ??
    (profileQuery.isError ? "프로필 정보를 불러올 수 없습니다." : null);

  useEffect(() => {
    if (isLoggedIn && user?.nickname && user.nickname === nickname) {
      router.replace("/profile/mypage");
    }
  }, [isLoggedIn, user?.nickname, nickname, router]);

  return (
    <div className="flex flex-col items-center gap-[10px] t:gap-[24px] w-full min-h-screen bg-[#F9F7F6] pb-[120px] t:pb-[100px]">
      <ProfileBreadcrumb nickname={nickname} />

      <div className="mt-[12px] md:mt-[56px]">
        <ProfileUserInfo nickname={nickname} />
      </div>

      <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 gap-[24px] mt-[10px] md:mt-[72px]">
        <OtherUserProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {profileTabErrorMessage ? (
          <ProfileTabUnavailableMessage
            activeTab={activeTab}
            profileMessage={profileTabErrorMessage}
          />
        ) : profileQuery.isLoading ? (
          <ProfileTabLoadingMessage />
        ) : (
          <>
            {activeTab === "stories" && <BookStoryList nickname={nickname} />}
            {activeTab === "library" && <LibraryList nickname={nickname} />}
            {activeTab === "meetings" && <MeetingList nickname={nickname} />}
          </>
        )}
      </div>
    </div>
  );
}
