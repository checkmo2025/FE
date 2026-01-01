"use client";

import React from "react";
import Image from "next/image";

type OthersProfileProps = {
  profileImgSrc?: string; // default: /profile.svg
  name: string;

  followingCount: number; // 구독중
  followerCount: number;  // 구독자
  isSubscribed: boolean;
  onToggleSubscribe: (newState: boolean) => void;

  intro: string;

  onSettings?: () => void;
  onReportClick?: () => void;

  className?: string;
};

export default function OthersProfile({
  profileImgSrc = "/profile3.svg",
  name,
  followingCount,
  followerCount,
  isSubscribed,
  onToggleSubscribe,
  onReportClick,
  intro,
  className = "",
}: OthersProfileProps) {
  return (
    <div
      className={[
        "w-[734px] h-[244px]",
        "flex flex-col",
        className,
      ].join(" ")}
    >
      <div className="flex items-start">
        <div className="py-[9px] pr-[36px] shrink-0">
          <div className="relative w-[138px] h-[138px] overflow-hidden rounded-full">
            <Image src={profileImgSrc} alt={name} fill className="object-cover" sizes="138px" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-[color:var(--Gray_7,#2C2C2C)] Subhead_1 truncate">{name}</p>

              <div className="h-[8px]" />

              <div className="flex items-center gap-[12px]">
                <p className="text-[color:var(--Gray_4,#8D8D8D)] Subhead_4_1">
                  구독중{" "}
                  <span className="text-[color:var(--Primary_1,#7B6154)] Subhead_4_1">
                    {followingCount}
                  </span>
                </p>
                <p className="text-[color:var(--Gray_4,#8D8D8D)] Subhead_4_1">
                  구독자{" "}
                  <span className="text-[color:var(--Primary_1,#7B6154)] Subhead_4_1">
                    {followerCount}
                  </span>
                </p>
              </div>

              <div className="h-[12px]" />

              <p className="text-[color:var(--Gray_4,#8D8D8D)] Body_1_2 line-clamp-4">
                {intro}
              </p>
            </div>

            
          </div>
        </div>
      </div>

      <div className="h-[40px]" />

      <div className="flex items-center gap-[24px]">
        <button
          type="button"
          onClick={() => onToggleSubscribe(!isSubscribed)}
          className={[
            "flex w-[532px] h-[48px] px-[16px] py-[12px] justify-center items-center gap-[10px] rounded-[8px]",
            "Subhead_4_1 whitespace-nowrap",
            isSubscribed
              ? "bg-[color:var(--Subbrown_4,#EAE5E2)] text-[color:var(--primary_3,#5E4A40)]"
              : "bg-[color:var(--Primary_1,#7B6154)] text-[color:var(--White,#FFF)]",
          ].join(" ")}
        >
          {isSubscribed ? "구독중" : "구독하기"}
        </button>

        <button
          type="button"
          onClick={onReportClick}
          className="
            flex w-[178px] h-[48px] px-[16px] py-[12px]
            justify-center items-center gap-[10px]
            rounded-[8px]
            border border-[color:var(--Subbrown_3,#D2C5B6)]
            bg-[color:var(--White,#FFF)]
            text-[color:var(--Gray_4,#8D8D8D)] Subhead_4_1
            whitespace-nowrap
          "
        >
          신고하기
        </button>
      </div>
    </div>
  );
}
