"use client";

import { useEffect, useMemo, useState } from "react";

import MeetingInfo from "@/components/base-ui/Bookcase/MeetingInfo";
import TeamFilter from "@/components/base-ui/Bookcase/bookid/TeamFilter";
import TeamSection from "@/components/base-ui/Bookcase/bookid/TeamSection";

/** ===== API 타입 (네가 준 응답 기준) ===== */
type MeetingDetailResult = {
  meetingId: number;
  title: string;
  meetingTime: string; // "2026-02-10T15:08:24.373372"
  location: string;
  existingTeamNumbers: number[];
  teams: {
    teamNumber: number;
    members: {
      clubMemberId: number;
      memberInfo: {
        nickname: string;
        profileImageUrl: string | null;
      };
    }[];
  }[];
  /** 서버에서 추가될 예정 */
  isAdmin?: boolean;
};

type Props = {
  meetingId: number;
  onManageTeamsClick?: () => void;
};

/** ===== 더미 (일단 동작 검증용) ===== */
const MOCK_MEETING_DETAIL: MeetingDetailResult = {
  meetingId: 1,
  title: "살인자ㅇ난감 함께 읽기",
  meetingTime: "2026-02-10T15:08:24.373372",
  location: "강남역 2번 출구",
  existingTeamNumbers: [1],
  teams: [
    {
      teamNumber: 1,
      members: [
        { clubMemberId: 1, memberInfo: { nickname: "테스터1", profileImageUrl: null } },
        { clubMemberId: 2, memberInfo: { nickname: "테스터2", profileImageUrl: null } },
      ],
    },
  ],
  isAdmin: true,
};

function formatDateDot(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    // fallback: 앞 10자리 "YYYY-MM-DD"
    return iso.slice(0, 10).replaceAll("-", ".");
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function teamNumberToLabel(teamNumber: number) {
  // 1 -> A조, 2 -> B조 ... (너 기존 dummy가 "A조"라서 맞춰줌)
  const code = 64 + teamNumber; // 'A' = 65
  if (code >= 65 && code <= 90) return `${String.fromCharCode(code)}조`;
  return `${teamNumber}조`;
}

export default function MeetingTabSection({ meetingId, onManageTeamsClick }: Props) {
  const [data, setData] = useState<MeetingDetailResult | null>(null);


  useEffect(() => {
    const load = async () => {
      // TODO: 여기서 API 호출로 교체
      setData({ ...MOCK_MEETING_DETAIL, meetingId });
    };

    load();
  }, [meetingId]);

  const teamLabels = useMemo(() => {
    if (!data) return [];
    const fromExisting = (data.existingTeamNumbers ?? []).map(teamNumberToLabel);
    const fromTeams = (data.teams ?? []).map((t) => teamNumberToLabel(t.teamNumber));
    // 중복 제거 + 순서 유지
    return Array.from(new Set([...fromExisting, ...fromTeams]));
  }, [data]);

  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // data 로딩되면 첫 팀으로 초기화
  useEffect(() => {
    if (teamLabels.length === 0) return;
    if (!selectedTeam || !teamLabels.includes(selectedTeam)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTeam(teamLabels[0]);
    }
  }, [teamLabels, selectedTeam]);

  const currentTeamMembers = useMemo(() => {
    if (!data) return null;
    const labelToNumber = (label: string) => {
      // "A조" -> 1, "B조" -> 2 ...
      const ch = label?.[0];
      if (!ch) return null;
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return code - 64;
      return null;
    };

    const teamNumber = labelToNumber(selectedTeam);
    const team = data.teams.find((t) => t.teamNumber === teamNumber);

    // TeamSection이 원하는 형태로 매핑 (너 예전 코드 기준)
    const members =
      team?.members.map((m) => ({
        id: String(m.clubMemberId),
        name: m.memberInfo.nickname,
        profileImageUrl: m.memberInfo.profileImageUrl ?? "/profile4.svg",
      })) ?? [];

    return {
      teamName: selectedTeam,
      members,
    };
  }, [data, selectedTeam]);

  if (!data) {
    return (
      <div className="w-full flex flex-col gap-[24px]">
        <div className="w-full rounded-[8px] bg-[#F2EFEE] p-[20px]">
          <span className="text-Gray-4 body_1_2">모임 정보 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start gap-[24px] self-stretch">
      {/* 2-1. 모임 정보 카드 */}
      <MeetingInfo
        meetingId={data.meetingId}
        meetingName={data.title}
        date={formatDateDot(data.meetingTime)}
        location={data.location}
        isAdmin={!!data.isAdmin}
        onManageGroupClick={onManageTeamsClick}
      />

      {/* 2-2. 조 + 멤버 (겉으로는 한 덩어리 UX) */}
      <div className="flex flex-col items-start gap-[16px] self-stretch">
        <TeamFilter
          teams={teamLabels}
          selectedTeam={selectedTeam}
          onSelect={setSelectedTeam}
        />

        {currentTeamMembers && (
          <TeamSection
            teamName={currentTeamMembers.teamName}
            members={currentTeamMembers.members}
          />
        )}
      </div>
    </div>
  );
}
