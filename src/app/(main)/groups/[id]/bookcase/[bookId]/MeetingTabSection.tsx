/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";

import MeetingInfo from "@/components/base-ui/Bookcase/MeetingInfo";
import TeamFilter from "@/components/base-ui/Bookcase/bookid/TeamFilter";
import TeamSection from "@/components/base-ui/Bookcase/bookid/TeamSection";

import { useMeetingDetailQuery } from "@/hooks/queries/useMeetingQueries";

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

function teamNumberToLabel(teamNumber: number) {
  const code = 64 + teamNumber;
  if (code >= 65 && code <= 90) return `${String.fromCharCode(code)}조`;
  return `${teamNumber}조`;
}

function labelToTeamNumber(label: string) {
  const ch = label?.[0];
  if (!ch) return null;
  const code = ch.charCodeAt(0);
  if (code >= 65 && code <= 90) return code - 64;
  return null;
}

export default function MeetingTabSection({ clubId, meetingId, onManageTeamsClick }: Props) {
  const { data, isLoading, isError } = useMeetingDetailQuery(clubId, meetingId);

  const teamLabels = useMemo(() => {
    if (!data) return [];

    const numsFromExisting = (data.existingTeams ?? []).map((t) => t.teamNumber);
    const numsFromMembers = (data.teamMembers ?? []).map((g) => g.teamKey.teamNumber);

    const uniq = Array.from(new Set([...numsFromExisting, ...numsFromMembers]))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);

    return uniq.map(teamNumberToLabel);
  }, [data]);

  const [selectedTeam, setSelectedTeam] = useState<string>("");

  useEffect(() => {
    if (teamLabels.length === 0) return;
    if (!selectedTeam || !teamLabels.includes(selectedTeam)) {
      setSelectedTeam(teamLabels[0]);
    }
  }, [teamLabels, selectedTeam]);

  const currentTeamMembers = useMemo(() => {
    if (!data) return null;

    const teamNumber = labelToTeamNumber(selectedTeam);
    if (!teamNumber) return null;

    const group = (data.teamMembers ?? []).find((g) => g.teamKey.teamNumber === teamNumber);

    const members =
      group?.members.map((m) => ({
        id: String(m.clubMemberId),
        name: m.memberInfo.nickname,
        profileImageUrl: m.memberInfo.profileImageUrl,
      })) ?? [];

    return {
      teamName: selectedTeam,
      members,
    };
  }, [data, selectedTeam]);

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

      <div className="flex flex-col items-start gap-[16px] self-stretch">
        <TeamFilter teams={teamLabels} selectedTeam={selectedTeam} onSelect={setSelectedTeam} />

        {currentTeamMembers && (
          <TeamSection teamName={currentTeamMembers.teamName} members={currentTeamMembers.members} />
        )}
      </div>
    </div>
  );
}
