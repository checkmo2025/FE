"use client";

import React from "react";
import AdminMeetingCard from "./items/AdminMeetingCard";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 ID */
  userId: string;
};

const MeetingList = ({ userId }: Props) => {
  /**
   * TODO:
   * 관리자 전용 "특정 사용자(userId) 모임 목록 조회" API가 아직 없어
   * 임시로 useMyClubsQuery()를 사용 중입니다.
   * 추후 useUserClubsQuery(userId) 형태로 교체 예정입니다.
   */
  void userId; // 현재는 사용하지 않지만 구조 통일을 위해 유지

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
        <AdminMeetingCard key={club.clubId} club={club} />
      ))}
    </div>
  );
};

export default MeetingList;