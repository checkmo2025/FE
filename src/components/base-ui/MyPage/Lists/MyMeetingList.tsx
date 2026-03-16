"use client";

import React from "react";
import MyMeetingCard from "./items/MyMeetingCard";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";

const MyMeetingList = () => {
  const { data, isLoading, isError } = useMyClubsQuery();
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
          가입한 독서 모임이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-[8px] w-full max-w-[1048px] px-[18px] md:px-[40px] lg:px-0 mx-auto">
      {clubs.map((club) => (
        <MyMeetingCard key={club.clubId} club={club} />
      ))}
    </div>
  );
};

export default MyMeetingList;
