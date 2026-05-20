"use client";

import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import BlockedUserItem from "@/components/base-ui/Settings/Block/BlockedUserItem";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

export default function BlockPageClient() {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useBlockedUsersQuery();
  const { ref } = useInView();

  // API 미구현으로 인한 임시 상태 및 핸들러 (리뷰 반영: Mock 데이터 도입)
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, nickname: "북클럽_매니아", profileImageUrl: "" },
    { id: 2, nickname: "책읽는_고양이", profileImageUrl: "" },
    { id: 3, nickname: "독서왕_제이", profileImageUrl: "" },
  ]);

  const handleUnblock = (id: number) => {
    // TODO: 차단 해제 API 연동 (현재는 로컬 Mock 상태에서만 삭제)
    setBlockedUsers((prev) => prev.filter((user) => user.id !== id));
  };

  if (isLoading) {
    return (
      <SettingsDetailLayout title="차단 관리" mode="wide" className="gap-[8px]">
        <div className="flex h-[200px] w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-2"></div>
        </div>
      </SettingsDetailLayout>
    );
  }

  if (isError) {
    return (
      <SettingsDetailLayout title="차단 관리" mode="wide" className="gap-[8px]">
        <div className="flex h-[200px] w-full items-center justify-center text-Gray-5">
          차단 목록을 불러오는 데 실패했습니다.
        </div>
      </SettingsDetailLayout>
    );
  }

  return (
    <SettingsDetailLayout title="차단 관리" mode="wide" className="gap-[8px]">
      {blockedUsers.length === 0 ? (
        <div className="flex h-[200px] w-full items-center justify-center text-Gray-5">
          차단한 사용자가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-[8px] w-full">
          {blockedUsers.map((user) => (
            <BlockedUserItem
              key={user.id}
              nickname={user.nickname}
              profileImageUrl={user.profileImageUrl}
              onUnblock={() => handleUnblock(user.id)}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-4 w-full" />
    </SettingsDetailLayout>
  );
}
