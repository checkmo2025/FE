"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import BlockedUserItem from "@/components/base-ui/Settings/Block/BlockedUserItem";
import { useBlockedUsersQuery } from "@/hooks/queries/useMemberQueries";
import { useUnblockMemberMutation } from "@/hooks/mutations/useMemberMutations";

export default function BlockPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useBlockedUsersQuery();
  const { mutate: unblock } = useUnblockMemberMutation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const blockedUsers = data?.pages.flatMap((page) => page.blocks) ?? [];

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
              key={user.memberId}
              nickname={user.nickname}
              profileImageUrl={user.profileImageUrl ?? undefined}
              onUnblock={() => unblock(user.nickname)}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-4 w-full" />
    </SettingsDetailLayout>
  );
}
