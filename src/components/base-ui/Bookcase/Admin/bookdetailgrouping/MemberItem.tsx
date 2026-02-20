"use client";

import Image from "next/image";
import type { TeamMember } from "@/types/groups/bookcasedetail";

const DEFAULT_PROFILE = "/profile4.svg";

type Props = {
  member: TeamMember;
  draggable?: boolean;
};

export default function MemberItem({ member, draggable = true }: Props) {
  const src = member.memberInfo.profileImageUrl ?? DEFAULT_PROFILE;

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => {
        if (!draggable) return;
        e.dataTransfer.setData(
          "application/x-checkmo-member",
          JSON.stringify({
            clubMemberId: member.clubMemberId,
            fromTeamNumber: member.teamNumber,
          })
        );
        e.dataTransfer.effectAllowed = "move";
      }}
      className={[
        "flex items-center gap-2.5",
        "w-full self-stretch",
        "px-5 py-4",
        "rounded-[8px]",
        "bg-White",
        draggable ? "cursor-grab active:cursor-grabbing" : "",
      ].join(" ")}
    >
      <div className="relative w-6 h-6 shrink-0 overflow-hidden rounded-full bg-Subbrown-4">
        <Image src={src} alt="profile" fill className="object-cover" />
      </div>

      <span className="body_1_2 text-Gray-7 truncate">
        {member.memberInfo.nickname}
      </span>
    </div>
  );
}
