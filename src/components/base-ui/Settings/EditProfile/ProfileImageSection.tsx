// src/components/base-ui/Settings/EditProfile/ProfileImageSection.tsx
"use client";

import Image from "next/image";

export default function ProfileImageSection() {
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
            src="/profile.svg"
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
            <span className="self-stretch subhead_1 text-Gray-7">_hy_0716</span>
            {/* 소개글 */}
            <p
              className="text-Gray-4 self-stretch break-keep
              text-[12px] font-medium leading-[145%] tracking-[-0.012px]
              xl:body_1_2"
            >
              이제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한 시간을
              시작해보세요. 한 권의 책이 주는 작은 울림이 일상에 큰 변화를
              가져올지도 모릅니다.
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
