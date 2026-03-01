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
import Image from "next/image";

import MemberPool from "@/components/base-ui/Bookcase/Admin/bookdetailgrouping/MemberPool";
import TeamBoard from "@/components/base-ui/Bookcase/Admin/bookdetailgrouping/TeamBoard";


import { useMeetingMembersQuery} from "@/hooks/queries/useMeetingQueries"; 
import type { TeamMemberListPutBody, TeamMember } from "@/types/groups/bookcasedetail";
import { normalizeTeams } from "@/types/groups/bookcasedetail";
import { useUpdateMeetingTeamsMutation } from "@/hooks/mutations/useMeetingMutations";

function toNumber(v: string | string[] | undefined): number {
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export default function AdminMeetingTeamManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const clubId = toNumber(params?.id as any);
  const meetingId = toNumber(params?.meetingId as any);

  const meetingName =
    searchParams.get("meetingName") || searchParams.get("name") || "정기모임 이름";

  const [teams, setTeams] = useState<number[]>([1]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 드래그 하이라이트용
  const [dragOverTeamNumber, setDragOverTeamNumber] = useState<number | null>(null);
  const [isDragOverPool, setIsDragOverPool] = useState(false);


  const { data, isLoading, isFetching, isError } = useMeetingMembersQuery(clubId, meetingId);

  const { mutateAsync: updateTeams, isPending: isSaving } = useUpdateMeetingTeamsMutation();

  useEffect(() => {
    if (isInitialized) return;
    if (!data) return;
    const existingTeamNumbers =
      data.existingTeams?.map((t: any) => Number(t.teamNumber)).filter(Number.isFinite) ?? [];

    const normalized = normalizeTeams(existingTeamNumbers);
    setTeams(normalized);

    const mappedMembers: TeamMember[] =
      data.clubMembers?.map((cm: any) => ({
        clubMemberId: cm.clubMemberId,
        memberInfo: {
          nickname: cm.memberInfo?.nickname ?? "",
          profileImageUrl: cm.memberInfo?.profileImageUrl ?? "",
        },
        teamNumber: cm.teamKey?.teamNumber ?? null,
      })) ?? [];

    setMembers(mappedMembers);
    setIsInitialized(true);
  }, [data, isInitialized]);

  const unassigned = useMemo(
    () => members.filter((m) => m.teamNumber == null),
    [members]
  );

  const handleAddTeam = () => {
    setTeams((prev) => {
      if (prev.length >= 7) return prev;
      const next = prev.length === 0 ? 1 : Math.max(...prev) + 1;
      return [...prev, next];
    });
  };

  const handleRemoveTeam = (teamNumber: number) => {
    if (teams.length <= 1) return;

    // teamNumber 삭제 -> 뒤 팀들 번호 -1 당기고, 삭제된 팀 멤버는 null로
    setTeams((prev) => {
      const filtered = prev.filter((t) => t !== teamNumber).sort((a, b) => a - b);
      return filtered.map((t) => (t > teamNumber ? t - 1 : t));
    });

    setMembers((prev) =>
      prev.map((m) => {
        if (m.teamNumber === teamNumber) return { ...m, teamNumber: null };
        if (m.teamNumber != null && m.teamNumber > teamNumber) {
          return { ...m, teamNumber: m.teamNumber - 1 };
        }
        return m;
      })
    );
  };

  const handleMoveMember = (clubMemberId: number, toTeamNumber: number | null) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.clubMemberId === clubMemberId ? { ...m, teamNumber: toTeamNumber } : m
      )
    );
  };

  const handleSubmit = async () => {
    if (!Number.isFinite(clubId) || !Number.isFinite(meetingId)) return;

    const body: TeamMemberListPutBody = {
      teamMemberList: teams
        .sort((a, b) => a - b)
        .map((teamNumber) => ({
          teamNumber,
          clubMemberIds: members
            .filter((m) => m.teamNumber === teamNumber)
            .map((m) => m.clubMemberId),
        })),
    };

    await updateTeams({ clubId, meetingId, body });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
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

      const clubMemberId = active.data.current?.clubMemberId as number | undefined;
      if (clubMemberId === undefined) return;

      const overId = over.id.toString();

      if (overId === "pool") {
        handleMoveMember(clubMemberId, null);
      } else if (overId.startsWith("team-")) {
        const toTeamNumber = Number(overId.replace("team-", ""));
        if (Number.isFinite(toTeamNumber)) handleMoveMember(clubMemberId, toTeamNumber);
      }
    } finally {
      setDragOverTeamNumber(null);
      setIsDragOverPool(false);
    }
  };

  const showLoading = isLoading || (!isInitialized && isFetching);

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
            <Image src="/Polygon7.svg" alt="뒤로가기" fill className="object-contain" priority />
          </div>
          <span>뒤로가기</span>
        </button>

        <div className="w-full t:px-10">
          <div
            className="
              w-full max-w-[1080px] mx-auto
              px-[18px] pt-[12px] pb-[40px]
              t:px-[10px] t:pt-[24px] t:pb-[40px]
            "
          >
            <h1 className="subhead_2 text-Gray-7">{meetingName}</h1>

            {isError && (
              <div className="mt-3 rounded-[12px] border border-Red bg-White p-4">
                <span className="body_1_2 text-Red">불러오기에 실패했습니다.</span>
              </div>
            )}

            <div className="mt-3 flex flex-col gap-3 t:mt-3 t:flex-row t:gap-5">
              <div className="w-full t:w-[280px] shrink-0 t:order-2">
                <MemberPool
                  unassigned={unassigned}
                  isDragOverPool={isDragOverPool}
                  onDragOverPool={setIsDragOverPool}
                  onMoveMember={handleMoveMember}
                  onSubmit={handleSubmit}
                />
                {/* 저장중이면 UX라도 알려줘라 인간아 */}
                {isSaving && (
                  <div className="mt-2 flex justify-center">
                    <span className="body_2_2 text-Gray-4">저장 중...</span>
                  </div>
                )}
              </div>

              <div className="flex-1 t:order-1">
                {showLoading ? (
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