"use client";

import Image from "next/image";
import TeamMemberItem from "./TeamMemberItem";

type Member = {
  id: string;
  name: string;
  profileImageUrl?: string;
};

type Props = {
  teamName: string;
  members: Member[];
};

export default function TeamSection({ teamName, members }: Props) {
  return (
    <div className="flex w-full flex-col items-start gap-[16px] self-stretch">
      {/* 헤더 (Frame 2087328792) */}
      <div className="flex items-center justify-between w-full">
        <span className="text-Gray-7 subhead_4_1">{teamName}</span>
        <div className="relative h-[24px] w-[24px]">
          <Image
            src="/Arrow-Right2.svg"
            alt="arrow right"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* 멤버 리스트 (Frame 2087328783) */}
      <div className="flex w-full flex-col items-start gap-[10px] self-stretch">
        {members.map((member) => (
          <TeamMemberItem
            key={member.id}
            name={member.name}
            profileImageUrl={member.profileImageUrl}
            onMoreClick={() => console.log(`${member.name} 더보기 클릭`)}
          />
        ))}
      </div>
    </div>
  );
}
