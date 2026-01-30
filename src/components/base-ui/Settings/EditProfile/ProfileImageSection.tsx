"use client";

import Image from "next/image";

export default function ProfileImageSection() {
  return (
    <div className="flex flex-col items-start gap-[32px] self-stretch">
      {/* 이미지 및 정보 영역 */}
      <div className="flex h-[138px] items-center justify-between self-stretch">
        <div className="relative flex h-[138px] w-[138px] shrink-0 items-center justify-center rounded-full border border-[#D2C5B6] bg-[#F9F7F6]">
          <Image
            src="/profile.svg"
            alt="프로필 이미지"
            fill
            className="object-cover rounded-full"
          />
        </div>

        <div className="flex w-[488px] flex-col items-center gap-[12px]">
          <div className="flex items-start self-stretch justify-between">
            <div className="flex w-full flex-col items-start gap-[8px]">
              <span className="self-stretch text-[24px] font-semibold leading-[135%] tracking-[-0.024px] text-[#2C2C2C]">
                _hy_0716
              </span>
              <p className="self-stretch text-[14px] font-medium leading-[145%] tracking-[-0.014px] text-[#8D8D8D]">
                이제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한 시간을
                시작해보세요. 한 권의 책이 주는 작은 울림이 일상에 큰 변화를
                가져올지도 모릅니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex items-center gap-[12px] self-stretch">
        <button className="flex h-[48px] flex-1 items-center justify-center gap-[10px] rounded-[8px] bg-[#7B6154] px-[16px] py-[12px]">
          <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-white">
            프로필 이미지 업로드
          </span>
        </button>
        <button className="flex h-[48px] flex-1 items-center justify-center gap-[10px] rounded-[8px] bg-[#7B6154] px-[16px] py-[12px]">
          <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-white">
            기본 프로필 이미지
          </span>
        </button>
      </div>
    </div>
  );
}
