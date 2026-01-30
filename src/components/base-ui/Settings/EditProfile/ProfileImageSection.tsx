"use client";

import Image from "next/image";

export default function ProfileImageSection() {
  return (
    <div className="flex flex-col items-start gap-[32px] self-stretch">
      {/* 이미지 및 정보 영역 */}
      <div className="flex items-center justify-between self-stretch h-auto xl:h-[138px]">
        {/* 프로필 이미지: 태블릿 100px / 데스크탑 138px */}
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

        {/* 텍스트 정보: 태블릿 너비 318px / 데스크탑 너비 488px */}
        <div
          className="flex flex-col items-center gap-[12px]
          w-[318px] xl:w-[488px]"
        >
          <div className="flex items-start self-stretch justify-between">
            <div className="flex w-full flex-col items-start gap-[8px]">
              {/* 닉네임 */}
              <span className="self-stretch subhead_1 text-Gray-7">
                _hy_0716
              </span>
              {/* 소개글: 태블릿 body_2_2 / 데스크탑 body_1_2 */}
              <p
                className="self-stretch text-Gray-4 body_2_2 xl:body_1_2"
              >
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
        <button className="flex h-[48px] flex-1 items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px]">
          <span className="subhead_4_1 text-White">프로필 이미지 업로드</span>
        </button>
        <button className="flex h-[48px] flex-1 items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px]">
          <span className="subhead_4_1 text-White">기본 프로필 이미지</span>
        </button>
      </div>
    </div>
  );
}
