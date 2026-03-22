"use client";

import Image from "next/image";

export type ChatTeam = {
  teamId: string;
  teamName: string;
  memberCount: number;
};

type Props = {
  isOpen: boolean;
  teams: ChatTeam[];
  onClose: () => void;
  onSelectTeam: (team: ChatTeam) => void;
  title?: string;
};

export default function ChatTeamSelectModal({
  isOpen,
  teams,
  onClose,
  onSelectTeam,
  title = "채팅 조 선택",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/10 p-5 t:pt-[54px]">
      <div className="w-full max-w-[404px] rounded-[8px] border border-Subbrown-4 bg-background shadow-[0_3px_5.1px_rgba(61,52,46,0.15)]">
        <div className="flex items-center justify-between border-b border-Subbrown-4 px-5 py-4">
          <h2 className="text-Gray-7 subhead_4_1">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="relative h-6 w-6 cursor-pointer hover:brightness-75"
            aria-label="닫기"
          >
            <Image src="/icon_minus_1.svg" alt="" fill className="object-contain" />
          </button>
        </div>

        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-5">
          {teams.length === 0 ? (
            <div className="rounded-[8px] bg-Subbrown-4 px-4 py-3 text-Gray-5 body_2_3">
              선택 가능한 조가 없습니다.
            </div>
          ) : (
            teams.map((team) => (
              <button
                key={team.teamId}
                type="button"
                onClick={() => onSelectTeam(team)}
                className="flex w-full items-center justify-between rounded-[8px] bg-Subbrown-4 px-4 py-4 text-left transition hover:brightness-95 cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-Gray-7 body_1_2">{team.teamName}</span>
                  <span className="text-Gray-5 body_2_3">인원 {team.memberCount}명</span>
                </div>

                <div className="relative h-6 w-6 shrink-0">
                  <Image src="/ArrowRight2.svg" alt="" fill className="object-contain" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}