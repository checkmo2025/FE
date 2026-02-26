"use client";

import React from "react";
import Image from "next/image";
import { MyClubInfo } from "@/types/club";

interface MyMeetingCardProps {
  club: MyClubInfo;
}

const MyMeetingCard = ({ club }: MyMeetingCardProps) => {
  return (
    <div
      className="
        w-full h-[72px]
        flex items-center justify-between
        px-[24px]
        rounded-[8px]
        bg-White
        border border-Subbrown-4
      "
    >
      <span className="subhead_3_2 text-Gray-7 truncate">
        {club.clubName}
      </span>

      <button
        type="button"
        className="flex items-center justify-center shrink-0"
      >
        <Image
          src="/ant-design_more-outlined.svg"
          alt="more"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default MyMeetingCard;