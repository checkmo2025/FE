"use client";

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";


import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";


import { fetchMeetingTeamsDummy } from "./dummy";
import { normalizeTeams, TeamMember, TeamMemberListPutBody } from "@/types/groups/bookcasedetail";
import MemberPool from "@/components/base-ui/Bookcase/Admin/bookdetailgrouping/MemberPool";
import TeamBoard from "@/components/base-ui/Bookcase/Admin/bookdetailgrouping/TeamBoard";
import Image from "next/image";
export default function AdminMeetingTeamManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Next가 params를 Record<string, string | string[]>로 주는 케이스가 있어서 안전빵
  const groupId = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string | undefined);
  const meetingId = Array.isArray(params?.meetingId)
    ? params?.meetingId[0]
    : (params?.meetingId as string | undefined);

  const meetingName =
    searchParams.get("meetingName") || searchParams.get("name") || "정기모임 이름";

  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<number[]>([1]);
  const [members, setMembers] = useState<TeamMember[]>([]);

  // 드래그 하이라이트용
  const [dragOverTeamNumber, setDragOverTeamNumber] = useState<number | null>(null);
  const [isDragOverPool, setIsDragOverPool] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setIsLoading(true);

      // TODO(API 연동): 여기서 GET /groups/{groupId}/meetings/{meetingId}/teams 같은 걸 호출해서
      // existingTeamNumbers + members를 받아오면 됨.
      const res = await fetchMeetingTeamsDummy();

      if (!alive) return;

      const normalized = normalizeTeams(res.result.existingTeamNumbers);
      setTeams(normalized);
      setMembers(res.result.members);
      setIsLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const unassigned = useMemo(
    () => members.filter((m) => m.teamNumber == null),
    [members]
  );

  const handleAddTeam = () => {
    setTeams((prev) => {
      if (prev.length >= 7) return prev;
      return [...prev, prev.length + 1];
    });
  };

  const handleRemoveTeam = (teamNumber: number) => {
    if (teams.length <= 1) return;

    // C(3) 삭제 -> A(1)B(2)C(3) 로 당기고, 기존 C에 있던 애들은 null로 빠지게.
    setTeams((prev) => {
      const filtered = prev.filter((t) => t !== teamNumber);
      return filtered.map((t) => (t > teamNumber ? t - 1 : t));
    });

    setMembers((prev) =>
      prev.map((m) => {
        if (m.teamNumber === teamNumber) return { ...m, teamNumber: null };
        if (m.teamNumber != null && m.teamNumber > teamNumber)
          return { ...m, teamNumber: m.teamNumber - 1 };
        return m;
      })
    );
  };

  const handleMoveMember = (clubMemberId: number, toTeamNumber: number | null) => {
    setMembers((prev) =>
      prev.map((m) => (m.clubMemberId === clubMemberId ? { ...m, teamNumber: toTeamNumber } : m))
    );
  };

  const handleSubmit = async () => {
    // PUT payload 만들기
    const body: TeamMemberListPutBody = {
      teamMemberList: teams.map((teamNumber) => ({
        teamNumber,
        clubMemberIds: members
          .filter((m) => m.teamNumber === teamNumber)
          .map((m) => m.clubMemberId),
      })),
    };

    // TODO(API 연동):
    // await fetch(`/api/groups/${groupId}/admin/bookcase/${meetingId}`, { method: 'PUT', body: JSON.stringify(body) })
    console.log("PUT payload:", body);
  };

  const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  // 모바일에서 스크롤/탭과 드래그 충돌 줄이려고 “롱프레스” 약간 줌
  useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 8 },
  })
);

const handleDndOver = ({ over }: DragOverEvent) => {
  const id = over?.id?.toString();
  if (!id) {
    setDragOverTeamNumber(null);
    setIsDragOverPool(false);
    return;
  }

  if (id === "pool") {
    setIsDragOverPool(true);
    setDragOverTeamNumber(null);
    return;
  }

  if (id.startsWith("team-")) {
    const teamNumber = Number(id.replace("team-", ""));
    setDragOverTeamNumber(Number.isFinite(teamNumber) ? teamNumber : null);
    setIsDragOverPool(false);
  }
};

const handleDndEnd = ({ active, over }: DragEndEvent) => {
  try {
    if (!over) return;

    const clubMemberId =
      (active.data.current?.clubMemberId as number | undefined) ??
      Number(String(active.id).replace("member-", ""));

    if (!clubMemberId) return;

    const overId = over.id.toString();

    if (overId === "pool") {
      handleMoveMember(clubMemberId, null);
    } else if (overId.startsWith("team-")) {
      const toTeamNumber = Number(overId.replace("team-", ""));
      if (Number.isFinite(toTeamNumber)) handleMoveMember(clubMemberId, toTeamNumber);
    }
  } finally {
    // 하이라이트 정리
    setDragOverTeamNumber(null);
    setIsDragOverPool(false);
  }
};


  return (
  <DndContext
    sensors={sensors}
    onDragOver={handleDndOver}
    onDragEnd={handleDndEnd}
    autoScroll
  >
    <div className="w-full">
      {/* 모바일 전용 뒤로가기 바 */}
      <button
        type="button"
        onClick={() => router.back()}
        className="
          t:hidden
          w-full
          flex items-center gap-2
          px-[10px] py-[12px]
          border-b border-Gray-2
          text-Gray-7 body_1_2
        "
      >
        <div className="relative w-[12px] h-[12px] shrink-0">
          <Image
            src="/Polygon7.svg"
            alt="뒤로가기"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span>뒤로가기</span>
      </button>

      {/* t 이상에서: 좌우 최소 40px 확보용 외곽 패딩 */}
      <div className="w-full t:px-10">
        {/* 실제 컨텐츠 래퍼 */}
        <div
          className="
            w-full max-w-[1080px] mx-auto
            px-[18px] pt-[12px] pb-[40px]
            t:px-[10px] t:pt-[24px] t:pb-[40px]
          "
        >
          {/* 타이틀 */}
          <h1 className="subhead_2 text-Gray-7">{meetingName}</h1>


          <div className="mt-3 flex flex-col gap-3 t:mt-3 t:flex-row t:gap-5">
            {/* 미배정 참여자 */}
            <div className="w-full t:w-[280px] shrink-0 t:order-2">
              <MemberPool
                unassigned={unassigned}
                isDragOverPool={isDragOverPool}
                onDragOverPool={setIsDragOverPool}
                onMoveMember={handleMoveMember}
                onSubmit={handleSubmit}
              />
            </div>

            {/* 팀 영역: 모바일 아래 / t 이상 왼쪽 */}
            <div className="flex-1 t:order-1">
              {isLoading ? (
                <div className="flex h-[240px] items-center justify-center rounded-[12px] border border-Subbrown-4 bg-White">
                  <span className="body_1_2 text-Gray-4">불러오는 중...</span>
                </div>
              ) : (
                <TeamBoard
                  teams={teams}
                  members={members}
                  dragOverTeamNumber={dragOverTeamNumber}
                  onDragOverTeam={setDragOverTeamNumber}
                  onAddTeam={handleAddTeam}
                  onRemoveTeam={handleRemoveTeam}
                  onMoveMember={handleMoveMember}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  </DndContext>
  
);
}
