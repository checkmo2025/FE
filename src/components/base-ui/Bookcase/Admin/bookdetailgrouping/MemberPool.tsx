"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TeamMember } from "@/types/groups/bookcasedetail";

const DEFAULT_PROFILE = "/profile.svg";

type Props = {
  unassigned: TeamMember[];

  isDragOverPool: boolean;
  onDragOverPool: (isOver: boolean) => void;

  // dnd-kit에서는 이동 처리를 page.tsx의 DndContext(onDragEnd)에서 하는 게 정석이라,
  // 여기서는 안 씀(그래도 props 시그니처 유지)
  onMoveMember: (clubMemberId: number, toTeamNumber: number | null) => void;

  onSubmit: () => void;
};

function DraggableUnassignedCard({
  member,
  highlighted,
}: {
  member: TeamMember;
  highlighted: boolean;
}) {
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
      className={[
        "flex items-center gap-[10px]",
        "rounded-[8px]",
        "px-3 py-2",
        "t:px-5 t:py-4",
        highlighted ? "bg-[#F3F0EE]" : "hover:bg-[#F3F0EE]",
        "transition-colors",
        "cursor-grab active:cursor-grabbing",
        // 모바일 스크롤 제스처랑 덜 싸우게
        "touch-pan-y select-none",
      ].join(" ")}
    >
      <div className="relative w-[24px] h-[24px] shrink-0 overflow-hidden rounded-full bg-Subbrown-4">
        <Image
          src={member.memberInfo.profileImageUrl ?? DEFAULT_PROFILE}
          alt="profile"
          fill
          className="object-cover"
        />
      </div>

      <span className="body_1_2 text-Gray-7 truncate">{member.memberInfo.nickname}</span>
    </div>
  );
}

export default function MemberPool({
  unassigned,
  isDragOverPool,
  onDragOverPool,
  onMoveMember: _onMoveMember, // 사용 안 함(린트용)
  onSubmit,
}: Props) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ✅ pool droppable
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });

  // 기존 하이라이트 상태 관리랑 맞춰주기
  useEffect(() => {
    onDragOverPool(isOver);
  }, [isOver, onDragOverPool]);

  const highlighted = isDragOverPool || isOver;

  const handleConfirmYes = () => {
    onSubmit();
    setIsConfirmOpen(false);
    router.back();
  };

  return (
    <div className="w-full">
      {/* 드랍 영역 전체(오른쪽 박스) */}
      <div
        ref={setNodeRef}
        className={[
          "flex flex-col items-start",
          "w-full",
          "gap-[17px]",
          "rounded-[8px] border border-Subbrown-4",
          "pb-5 px-5",
          highlighted ? "bg-[#F3F0EE]" : "",
          "transition-colors",
        ].join(" ")}
      >
        {/* 헤더 */}
        <div className="w-full items-center border-b border-Subbrown-3 px-3 py-4">
          <span className="body_1_2 text-Gray-4">토론 참여자</span>
        </div>

        {/* 목록 */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-2 t:flex t:flex-col t:gap-2">
            {unassigned.length === 0 ? (
              <div className="col-span-2 rounded-[8px] bg-[#F3F0EE] py-6">
                <div className="flex items-center justify-center">
                  <span className="body_2_2 text-Gray-4">남는 인원이 없어요</span>
                </div>
              </div>
            ) : (
              unassigned.map((m) => (
                <DraggableUnassignedCard
                  key={m.clubMemberId}
                  member={m}
                  highlighted={highlighted}
                />
              ))
            )}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className={[
              "w-full h-[44px] rounded-[8px]",
              "bg-primary-2 text-white body_1_2",
              "cursor-pointer hover:brightness-90 active:brightness-90",
              "transition",
            ].join(" ")}
          >
            조 편성 저장
          </button>
        </div>
      </div>

      {/* 확인 모달 */}
      {isConfirmOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs px-4 py-4"
            onClick={() => setIsConfirmOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
            <div className="w-full max-w-[380px] rounded-[12px] border border-Subbrown-4 bg-background p-5">
              <p className="subhead_4_1 text-Gray-7">수정하시겠습니까?</p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmYes}
                  className={[
                    "flex-1 h-[44px] rounded-[8px]",
                    "bg-primary-2 text-white body_1_2",
                    "cursor-pointer hover:brightness-90 active:brightness-90",
                  ].join(" ")}
                >
                  예
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className={[
                    "flex-1 h-[44px] rounded-[8px]",
                    "border border-Subbrown-4",
                    "text-Gray-7 body_1_2",
                    "cursor-pointer hover:brightness-90 active:brightness-90",
                  ].join(" ")}
                >
                  아니오
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
