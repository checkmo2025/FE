"use client";

import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
// import BlockedUserItem from "@/components/base-ui/Settings/Block/BlockedUserItem";
// import { useBlockedUsersQuery } from "@/hooks/queries/useMemberQueries"; // API 미구현
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export default function BlockPage() {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useBlockedUsersQuery();
  const { ref, inView } = useInView();

  // API 미구현으로 인한 임시 상태 및 핸들러
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const [blockedUsers] = useState([]); // 현재는 빈 목록

  /*
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  */

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
          {/* 
          {blockedUsers.map((user, idx) => (
            <BlockedUserItem
              key={`${user.id}-${idx}`}
              nickname={user.nickname}
              profileImageUrl={user.profileImageUrl}
              onUnblock={() => {
                // TODO: 차단 해제 API 연동
                console.log("Unblock", user.nickname);
              }}
            />
          ))}
          */}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-4 w-full" />
      {/* 
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary-2"></div>
        </div>
      )}
      */}
    </SettingsDetailLayout>
  );
}
