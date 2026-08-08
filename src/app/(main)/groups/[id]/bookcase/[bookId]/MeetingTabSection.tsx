"use client";

import MeetingInfo from "@/components/base-ui/Bookcase/MeetingInfo";

import { useMeetingDetailQuery } from "@/hooks/queries/useMeetingQueries";
import MeetingPageClient from "./meeting/MeetingPageClient";

type Props = {
  clubId: number;
  meetingId: number;
  onManageTeamsClick?: () => void;
};

function formatDateDot(iso?: string | null) {
  if (!iso?.trim()) return "";

  // meetingTime은 백엔드 LocalDateTime(시간대 없음) 날짜 값이라
  // new Date()로 파싱하면 시간대에 따라 하루 밀릴 수 있다. 날짜 부분만 추출한다.
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return iso.slice(0, 10).replaceAll("-", ".");
}

export default function MeetingTabSection({ clubId, meetingId, onManageTeamsClick }: Props) {
  const { data, isLoading, isError } = useMeetingDetailQuery(clubId, meetingId);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-[24px]">
        <div className="w-full rounded-[8px] bg-[#F2EFEE] p-[20px]">
          <span className="text-Gray-4 body_1_2">모임 정보 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full flex flex-col gap-[24px]">
        <div className="w-full rounded-[8px] bg-[#F2EFEE] p-[20px]">
          <span className="text-Red-500 body_1_2">모임 정보를 불러오지 못했습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start gap-[24px] self-stretch">
      <MeetingInfo
        meetingId={data.meetingId}
        meetingName={data.title?.trim() || "정기모임"}
        date={formatDateDot(data.meetingTime) || "날짜 미정"}
        location={data.location?.trim() || "장소 미정"}
        isAdmin={!!data.isStaff}
        onManageGroupClick={onManageTeamsClick}
      />

      <MeetingPageClient clubId={clubId} meetingId={meetingId} embedded />
    </div>
  );
}
