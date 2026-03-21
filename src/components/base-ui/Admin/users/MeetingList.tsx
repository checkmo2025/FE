"use client";

import React, { useEffect, useState } from "react";
import AdminMeetingCard from "./items/AdminMeetingCard";
import {
  fetchAdminMemberClubs,
  type AdminMemberClubItem,
} from "@/lib/api/admin/member";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 닉네임 */
  memberNickname: string;
};

const MeetingList = ({ memberNickname }: Props) => {
  const [clubs, setClubs] = useState<AdminMemberClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetchAdminMemberClubs(memberNickname);
        setClubs(res.result.clubList ?? []);
      } catch (error) {
        console.error("가입 모임 조회 실패:", error);
        setClubs([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, [memberNickname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-Gray-4 text-sm font-medium">
        불러오는 중...
      </div>
    );
  }

  if (error) {
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