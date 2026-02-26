"use client";

import Image from "next/image";

type Props = {
  meetingId?: number;
  meetingName: string;
  date: string; // "2026.02.10"
  location: string;
  isAdmin?: boolean;
  onManageGroupClick?: () => void;
};

export default function MeetingInfo({
  meetingName,
  date,
  location,
  isAdmin = false,
  onManageGroupClick,
}: Props) {
  return (
    <div className="flex w-full h-[124px] flex-col justify-between items-center rounded-[8px] bg-[#F2EFEE] p-[20px]">
      {/* 정보 컨테이너 */}
      <div className="flex w-full flex-col items-start justify-center gap-[12px]">
        {/* 상단: 모임 이름 + 조 관리 버튼 */}
        <div className="flex w-full items-center justify-between">
          {/* 모임 이름 */}
          <div className="flex items-center gap-[8px]">
            <span className="text-Gray-7 subhead_4_1">{meetingName}</span>
          </div>

          {/* ✅ 관리자일 때만 노출 */}
          {isAdmin && onManageGroupClick && (
            <button
              onClick={onManageGroupClick}
              className="flex items-center gap-[8px] px-[8px] hover:bg-black/5 rounded transition-colors"
            >
              <span className="text-Gray-4 body_1_2 cursor-pointer">조 관리하기</span>
              <div className="relative h-[24px] w-[24px]">
                <Image src="/Setting.svg" alt="설정" fill className="object-contain" />
              </div>
            </button>
          )}
        </div>

        {/* 하단: 날짜 / 장소 */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-Gray-4 body_1_2">{date}</span>
          <span className="text-Gray-4 body_1_2">{location}</span>
        </div>
      </div>
    </div>
  );
}
