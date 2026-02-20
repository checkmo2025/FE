"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { MAX_TEAMS, teamLabel, TeamMember } from "@/types/groups/bookcasedetail";
import MemberItem from "./MemberItem";

type Props = {
  teams: number[];
  members: TeamMember[];

  dragOverTeamNumber: number | null;
  onDragOverTeam: (teamNumber: number | null) => void;

  onAddTeam: () => void;
  onRemoveTeam: (teamNumber: number) => void;

  // dnd-kit에선 이동 처리를 page.tsx onDragEnd에서 하는 게 정석이라 여기선 안 씀
  onMoveMember: (clubMemberId: number, toTeamNumber: number | null) => void;
};

function DraggableMember({ member }: { member: TeamMember }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `member-${member.clubMemberId}`,
    data: {
      clubMemberId: member.clubMemberId,
      fromTeamNumber: member.teamNumber,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-full touch-pan-y select-none"
    >
      {/* ✅ UI는 기존 MemberItem 그대로 재사용 */}
      <MemberItem member={member} />
    </div>
  );
}

function TeamDropCard({
  teamNumber,
  label,
  teamsLength,
  teamMembers,
  dragOverTeamNumber,
  onDragOverTeam,
  onRemoveTeam,
}: {
  teamNumber: number;
  label: string;
  teamsLength: number;
  teamMembers: TeamMember[];
  dragOverTeamNumber: number | null;
  onDragOverTeam: (teamNumber: number | null) => void;
  onRemoveTeam: (teamNumber: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `team-${teamNumber}` });

  // 기존 하이라이트 상태(dragOverTeamNumber)를 쓰고 있길래 동기화만 해줌
  useEffect(() => {
    if (isOver) onDragOverTeam(teamNumber);
    else if (dragOverTeamNumber === teamNumber) onDragOverTeam(null);
  }, [isOver, teamNumber, dragOverTeamNumber, onDragOverTeam]);

  const highlighted = isOver || dragOverTeamNumber === teamNumber;

  return (
    <div
      ref={setNodeRef}
      className={[
        "w-full self-stretch",
        "flex flex-col items-start",
        "rounded-[8px]",
        "bg-[#F3F0EE]",
        "px-5 pb-5",
        "gap-5",
        highlighted ? "brightness-95" : "",
        "transition",
      ].join(" ")}
    >
      {/* 위쪽 박스 */}
      <div className="w-full border-b border-Subbrown-4 py-2 flex items-center justify-between">
        <div className="px-3 py-2.5">
          <span className="body_1_2 text-Gray-7">{label}조</span>
        </div>

        <button
          type="button"
          onClick={() => onRemoveTeam(teamNumber)}
          disabled={teamsLength <= 1}
          className={["hover:brightness-50 cursor-pointer hover:scale-[1.07]"].join(" ")}
          aria-label="팀 삭제"
          title="팀 삭제"
        >
          <div className="relative w-5 h-5">
            <Image src="/icon_minus_1.svg" alt="삭제" fill className="object-contain" />
          </div>
        </button>
      </div>

      {/* 인물들 */}
      <div className="w-full flex flex-col gap-2">
        {teamMembers.length === 0 ? (
          <div className="w-full self-stretch px-5 py-4 rounded-[8px]">
            <span className="body_2_2 text-Gray-4">여기로 드래그해서 추가</span>
          </div>
        ) : (
          teamMembers.map((m) => <DraggableMember key={m.clubMemberId} member={m} />)
        )}
      </div>
    </div>
  );
}

export default function TeamBoard({
  teams,
  members,
  dragOverTeamNumber,
  onDragOverTeam,
  onAddTeam,
  onRemoveTeam,
  onMoveMember: _onMoveMember, // 사용 안 함(린트용)
}: Props) {
  const canAdd = teams.length < MAX_TEAMS;

  return (
    <section className="w-full flex flex-col gap-6">
      {/* 상단 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-Subbrown-3">
        <div className="flex-1 px-3 py-2.5">
          <span className="body_1_2 text-Gray-4">조</span>
        </div>

        <button
          type="button"
          onClick={onAddTeam}
          disabled={!canAdd}
          className={["hover:brightness-50 cursor-pointer hover:scale-[1.05]"].join(" ")}
          aria-label="팀 추가"
        >
          <div className="relative w-5 h-5">
            <Image src="/icon_plus_2.svg" alt="추가" fill className="object-contain" />
          </div>
        </button>
      </div>

      {/* 팀 리스트 */}
      <div className="flex flex-col gap-8">
        {teams.map((teamNumber) => {
          const label = teamLabel(teamNumber);
          const teamMembers = members.filter((m) => m.teamNumber === teamNumber);

          return (
            <TeamDropCard
              key={teamNumber}
              teamNumber={teamNumber}
              label={label}
              teamsLength={teams.length}
              teamMembers={teamMembers}
              dragOverTeamNumber={dragOverTeamNumber}
              onDragOverTeam={onDragOverTeam}
              onRemoveTeam={onRemoveTeam}
            />
          );
        })}
      </div>
    </section>
  );
}
