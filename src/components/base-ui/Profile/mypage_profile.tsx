"use client";

import React from "react";
import Image from "next/image";

type MypageProfileProps = {
  profileImgSrc?: string; // default: /profile.svg
  name: string;

  followingCount: number; // 구독중
  followerCount: number;  // 구독자

  intro: string;

  onEditProfile?: () => void;
  onSettings?: () => void;

  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;

  className?: string;
};

export default function MypageProfile({
  profileImgSrc = "/profile3.svg",
  name,
  followingCount,
  followerCount,
  intro,
  onEditProfile,
  onSettings,
  onLeftButtonClick,
  onRightButtonClick,
  className = "",
}: MypageProfileProps) {
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

            <div className="flex items-center shrink-0 ">
              <button
                type="button"
                onClick={onEditProfile}
                className="
                  flex w-[144px] px-[12px] py-[12px]
                  justify-center items-center gap-[12px]
                  rounded-[8px]
                  border border-[color:var(--Subbrown_4,#EAE5E2)]
                  bg-[color:var(--White,#FFF)]
                "
              >
                <Image src="/Edit_icon.svg" alt="" width={24} height={24} />
                <span className="text-[color:var(--Gray_5,#5C5C5C)] Subhead_4 whitespace-nowrap">
                  프로필 편집
                </span>
              </button>

              <div className="w-[8px]" />

              <button type="button" onClick={onSettings} className="w-[24px] h-[24px] ">
                <Image src="/setting_icon.svg" alt="" width={24} height={24} className="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[40px]" />

      <div className="flex items-center gap-[24px]">
        <button
          type="button"
          onClick={onLeftButtonClick}
          className="
            flex w-[355px] h-[48px] px-[16px] py-[12px]
            justify-center items-center gap-[10px]
            rounded-[8px]
            bg-[color:var(--Primary_1,#7B6154)]
            text-[color:var(--White,#FFF)] Subhead_4_1
            whitespace-nowrap
          "
        >
          책 이야기 쓰기
        </button>

        <button
          type="button"
          onClick={onRightButtonClick}
          className="
            flex w-[355px] h-[48px] px-[16px] py-[12px]
            justify-center items-center gap-[10px]
            rounded-[8px]
            bg-[color:var(--Primary_1,#7B6154)]
            text-[color:var(--White,#FFF)] Subhead_4_1
            whitespace-nowrap
          "
        >
          소식 문의하기
        </button>
      </div>
    </div>
  );
}
