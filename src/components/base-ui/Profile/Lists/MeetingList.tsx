"use client";

import React from "react";
import MeetingCard from "@/components/base-ui/Profile/items/MeetingCard";
import { useMemberClubsQuery } from "@/hooks/queries/useClubQueries";

export default function MeetingList({ nickname }: { nickname: string }) {
  const { data, isLoading, isError } = useMemberClubsQuery(nickname);
  const clubs = data?.clubList || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-Gray-4 text-sm font-medium">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-red-500 text-sm font-medium">
        독서 모임을 불러오는 데 실패했습니다.
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <p className="text-Gray-4 text-sm font-medium whitespace-pre-wrap text-center">
          작성된 소속 모임이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex w-full max-w-[1048px] flex-col items-center
      gap-[12px]
      px-0 mx-auto
      md:gap-[8px]"
    >
      {clubs.map((club) => (
        <MeetingCard
          key={club.clubId}
          title={club.clubName}
          showMoreIcon={false}
        />
      ))}
    </div>
  );
}
