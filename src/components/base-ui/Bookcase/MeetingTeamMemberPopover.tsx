"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import type { MeetingTeamMemberItem } from "@/types/groups/meetingDetail";

type Props = {
  memberCount: number;
  members: MeetingTeamMemberItem[];
};

const DEFAULT_PROFILE = "/profile4.svg";

function normalizeSrc(src?: string | null) {
  if (!src || src.trim() === "") return DEFAULT_PROFILE;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}

export default function MeetingTeamMemberPopover({
  memberCount,
  members,
}: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  const normalizedMembers = useMemo(
    () =>
      members.map((member) => ({
        clubMemberId: member.clubMemberId,
        nickname: member.memberInfo.nickname,
        profileImageUrl: normalizeSrc(member.memberInfo.profileImageUrl),
      })),
    [members]
  );

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickMember = (nickname: string) => {
    setIsOpen(false);
    router.push(`/profile/${encodeURIComponent(nickname)}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="
          flex items-center gap-1 rounded-[6px] px-1.5 py-1
          text-Gray-5 transition
          hover:bg-Gray-1 active:scale-[0.98]
          cursor-pointer
        "
        aria-label="조원 명단 보기"
      >
        <div className="relative w-4 h-4 t:w-5 t:h-5">
          <Image src="/profile10.svg" alt="" fill className="object-contain" />
        </div>
        <span className="body_2_3">{memberCount}</span>
      </button>

      {isOpen && (
        <div
          className="
            absolute left-0 top-full mt-2 z-[30]
            flex max-h-[292px] w-[236px] flex-col items-center
            rounded-[8px] border border-Subbrown-4 bg-White
            py-3 shadow-[0_3px_10px_rgba(61,52,46,0.12)]
          "
        >
          <div
            className="
              flex h-full w-full flex-col items-center overflow-y-auto
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            "
          >
            {normalizedMembers.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center px-4 text-center text-Gray-4 body_2_3">
                배정된 조원이 없습니다.
              </div>
            ) : (
              normalizedMembers.map((member) => (
                <div
                  key={member.clubMemberId}
                  className="flex w-[204px] items-center border-b border-Subbrown-4 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => handleClickMember(member.nickname)}
                    className="
                      flex w-[204px] items-center gap-3 px-2 py-2
                      text-left transition hover:bg-Gray-1 rounded-[8px]
                      cursor-pointer
                    "
                  >
                    <Image
                      src={member.profileImageUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                    <span className="min-w-0 truncate text-Gray-7 body_1_3">
                      {member.nickname}
                    </span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}