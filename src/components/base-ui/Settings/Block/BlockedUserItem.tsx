"use client";

import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

type Props = {
  nickname: string;
  profileImageUrl?: string;
  onUnblock?: () => void;
};

export default function BlockedUserItem({
  nickname,
  profileImageUrl,
  onUnblock,
}: Props) {
  return (
    <div
      className="flex items-center justify-between rounded-[8px] border border-Subbrown-4 bg-White p-[20px]
      w-full h-[80px]
      md:w-[440px]
      xl:w-[1000px]"
    >
      <div className="flex items-center gap-[12px]">
        {/* Profile Image */}
        <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full border border-[#D2C5B6] bg-[#F9F7F6]">
          <Image
            src={profileImageUrl || DEFAULT_PROFILE_IMAGE}
            alt={`${nickname} profile`}
            fill
            className="object-cover"
          />
        </div>
        {/* Nickname */}
        <span className="subhead_4_1 text-Gray-7 truncate max-w-[150px] md:max-w-[200px]">
          {nickname}
        </span>
      </div>

      {/* Unblock Button */}
      <button
        type="button"
        onClick={onUnblock}
        className="flex h-[28px] w-[79px] items-center justify-center rounded-[8px] border border-Subbrown-3 bg-White transition-colors hover:bg-gray-50"
      >
        <span className="text-[12px] font-semibold leading-[100%] text-Gray-5">
          차단 해제
        </span>
      </button>
    </div>
  );
}
