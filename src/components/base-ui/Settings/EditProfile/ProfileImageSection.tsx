// src/components/base-ui/Settings/EditProfile/ProfileImageSection.tsx
"use client";

import Image from "next/image";

interface Props {
  nickname?: string;
  intro?: string;
  profileImageUrl?: string;
}

export default function ProfileImageSection({
  nickname,
  intro,
  profileImageUrl,
}: Props) {
  return (
    <div className="flex flex-col items-start gap-[32px] self-stretch">
      {/* 이미지 및 정보 영역 */}
      <div
        className="flex flex-col items-center gap-[20px] self-stretch 
        md:flex-row md:items-center md:justify-between md:gap-0 md:h-auto xl:h-[138px]"
      >
        {/* 프로필 이미지 */}
        <div
          className="relative shrink-0 items-center justify-center rounded-full border border-Subbrown-3 bg-background
          h-[100px] w-[100px] xl:h-[138px] xl:w-[138px]"
        >
          <Image
            src={profileImageUrl || "/profile.svg"}
            alt="프로필 이미지"
            fill
            className="object-cover rounded-full"
          />
        </div>

        {/* 텍스트 정보 */}
        <div
          className="flex flex-col items-center gap-[12px]
          w-full md:w-[318px] xl:w-[488px]"
        >
          <div className="flex w-full flex-col items-start gap-[8px]">
            {/* 닉네임 */}
            <span className="self-stretch subhead_1 text-Gray-7">
              {nickname || "Loading..."}
            </span>
            {/* 소개글 */}
            <p
              className="text-Gray-4 self-stretch break-keep
              text-[12px] font-medium leading-[145%] tracking-[-0.012px]
              xl:body_1_2"
            >
              {intro || "자기소개를 입력해주세요."}
            </p>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex items-center gap-[12px] self-stretch">
        <button
          className="flex flex-1 items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px]
          h-[36px] md:h-[48px]"
        >
          <span
            className="text-White
            text-[14px] font-semibold leading-[145%] tracking-[-0.014px]
            md:subhead_4_1"
          >
            프로필 이미지 업로드
          </span>
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px]
          h-[36px] md:h-[48px]"
        >
          <span
            className="text-White
            text-[14px] font-semibold leading-[145%] tracking-[-0.014px]
            md:subhead_4_1"
          >
            기본 프로필 이미지
          </span>
        </button>
      </div>
    </div>
  );
}
