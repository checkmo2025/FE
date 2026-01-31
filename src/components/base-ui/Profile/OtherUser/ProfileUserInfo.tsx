"use client";

import Image from "next/image";

export default function ProfileUserInfo({ nickname }: { nickname: string }) {
  return (
    // 전체 컨테이너 (프로필 정보 + 버튼)
    // 모바일: 너비 339px, gap 24px
    <div
      className="flex flex-col items-center
      w-[339px] gap-[24px]
      md:w-[688px] md:gap-[40px] xl:w-[734px]"
    >
      {/* 1. 프로필 정보 섹션 (이미지 + 텍스트) */}
      {/* Frame 2087328519 -> Frame 2087328520 */}
      {/* 모바일: flex-row, items-start, gap-24px (명세 반영) */}
      <div
        className="flex w-full items-start
        flex-row gap-[24px]
        md:items-center md:gap-[38px]"
      >
        {/* 이미지 영역 (image_프로필) */}
        {/* 모바일: 80x80 */}
        <div
          className="relative shrink-0 items-center justify-center rounded-full border border-[#D2C5B6] bg-[#F9F7F6] overflow-hidden
          h-[80px] w-[80px]
          md:h-[138px] md:w-[138px]"
        >
          <Image
            src="/profile.svg"
            alt={`${nickname}님의 프로필`}
            fill
            className="object-cover"
          />
        </div>

        {/* 텍스트 정보 영역 (Frame 2087328476) */}
        {/* 모바일: w-[189px], gap 12px */}
        <div
          className="flex flex-col
          items-start w-[189px] gap-[12px]
          md:w-[512px] md:items-center xl:w-[558px]"
        >
          {/* 이름 & 통계 (Frame 2087328475) */}
          <div className="flex items-start justify-between w-full">
            {/* Frame 2087328474 */}
            <div className="flex w-full flex-col gap-[8px] items-start">
              {/* 닉네임 (_hy_0716) */}
              <h1
                className="text-[#2C2C2C] font-semibold leading-[135%] tracking-[-0.02px]
                text-[20px]
                md:text-[24px] md:tracking-[-0.024px]"
              >
                {nickname}
              </h1>

              {/* 구독 통계 (Frame 2087328473) */}
              <div className="flex items-center gap-[12px]">
                <div className="flex items-center gap-[4px] md:gap-[4px]">
                  <span
                    className="text-[#8D8D8D] font-medium leading-[145%] tracking-[-0.014px]
                    text-[14px] md:text-[18px]"
                  >
                    구독 중
                  </span>
                  <span
                    className="text-[#7B6154] font-medium leading-[145%] tracking-[-0.014px]
                    text-[14px] md:text-[18px]"
                  >
                    2
                  </span>
                </div>

                <div className="flex items-center gap-[4px] md:gap-[4px]">
                  <span
                    className="text-[#8D8D8D] font-medium leading-[145%] tracking-[-0.014px]
                    text-[14px] md:text-[18px]"
                  >
                    구독자
                  </span>
                  <span
                    className="text-[#7B6154] font-medium leading-[145%] tracking-[-0.014px]
                    text-[14px] md:text-[18px]"
                  >
                    2
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 소개글 */}
          {/* 모바일: w-[189px], 12px, Gray_4 */}
          <p
            className="break-keep text-[#8D8D8D]
            w-[189px] text-[12px] font-normal leading-[145%] tracking-[-0.012px] text-left
            md:w-full md:text-[14px] md:font-medium md:tracking-[-0.014px]"
          >
            이제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한 시간을
            시작해보세요. 한 권의 책이 주는 작은 울림이...
          </p>
        </div>
      </div>

      {/* 2. 버튼 그룹 (Frame 2087328478) */}
      <div
        className="flex items-center
        gap-[19px] w-full justify-center
        md:gap-[24px]"
      >
        {/* 구독하기 버튼 (CTA1) */}
        {/* 모바일: w-[220px] h-[32px] */}
        <button
          type="button"
          className="flex items-center justify-center rounded-[8px] bg-[#7B6154] transition-colors
            w-[220px] h-[32px]
            md:w-[486px] md:h-[48px] xl:w-[532px]"
        >
          <span
            className="text-white font-semibold leading-[145%] tracking-[-0.014px]
            text-[14px]
            md:text-[18px] md:font-medium"
          >
            구독하기
          </span>
        </button>

        {/* 신고하기 버튼 (CTA2) */}
        {/* 모바일: w-[100px] h-[32px] */}
        <button
          type="button"
          className="flex shrink-0 items-center justify-center rounded-[8px] border border-[#D2C5B6] bg-white transition-colors hover:bg-gray-50
            w-[100px] h-[32px]
            md:w-[178px] md:h-[48px]"
        >
          <span
            className="text-[#8D8D8D] font-medium leading-[145%] tracking-[-0.014px]
            text-[14px]
            md:text-[18px]"
          >
            신고하기
          </span>
        </button>
      </div>
    </div>
  );
}
