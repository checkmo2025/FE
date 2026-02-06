"use client";

import Image from "next/image";

type Props = {
  meetingName: string;
  date: string; // 예: "2000.00.00"
  location: string; // 예: "제이스 스터디룸"
  onManageGroupClick?: () => void;
};

export default function MeetingInfo({
  meetingName,
  date,
  location,
  onManageGroupClick,
}: Props) {
  return (
    <div className="flex w-full h-[124px] flex-col justify-between items-center rounded-[8px] bg-[#F2EFEE] p-[20px]">
      {/* 정보 컨테이너 */}
      <div className="flex w-full flex-col items-start justify-center gap-[12px]">
        {/* 상단: 모임 이름 + 조 관리 버튼 */}
        <div className="flex  items-center justify-between">
          {/* 모임 이름 영역 */}
          <div className="flex flex-col items-start gap-[24px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[8px]">
                <div className="relative h-[24px] w-[24px]">
                  <Image src="/groups_3User.svg" alt="모임 아이콘" fill />
                </div>
                {/* 모임 이름: Subhead_4.1 */}
                <span className="text-Gray-7 subhead_4_1">{meetingName}</span>
              </div>
            </div>
          </div>

          {/* 조 관리하기 버튼 */}
          <button
            onClick={onManageGroupClick}
            className="flex items-center gap-[8px] px-[8px] hover:bg-black/5 rounded transition-colors"
            >
            <span className="underline text-Gray-4 body_1_2">조 관리하기</span>
            <div className="relative h-[24px] w-[24px]">
              <Image src="/Setting.svg" alt="설정" fill />
            </div>
          </button>
        </div>

        {/* 하단: 일정 및 장소 정보 */}
        <div className="flex flex-col items-start gap-[8px] px-[32px]">
          {/* 일정 */}
          <div className="flex items-center gap-[8px]">
            <div className="relative h-[20px] w-[20px]">
              <Image src="/Calendar.svg" alt="달력" fill />
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-Gray-5 body_1_3">{date}</span>
            </div>
          </div>

          {/* 장소 */}
          <div className="flex w-full items-center gap-[8px]">
            <div className="relative h-[20px] w-[20px]">
              <Image src="/Location2.svg" alt="위치" fill />
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-Gray-5 body_1_3">{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
