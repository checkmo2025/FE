"use client";

import Image from "next/image";

// [보조 컴포넌트] 액션 버튼 (구독하기 / 신고하기)
function ActionButton({
  variant,
  label,
}: {
  variant: "primary" | "secondary";
  label: string;
}) {
  const baseStyles =
    "flex items-center justify-center rounded-[8px] transition-colors";

  const variants = {
    primary:
      "bg-primary-1 text-White font-semibold t:font-medium w-[220px] h-[32px] t:w-[486px] t:h-[48px] d:w-[532px]",

    secondary:
      "bg-White border border-Subbrown-3 text-Gray-4 font-medium hover:bg-gray-50 w-[100px] h-[32px] t:w-[178px] t:h-[48px]",
  };

  const textStyles = "body_1_2 t:subhead_4_1";

  return (
    <button type="button" className={`${baseStyles} ${variants[variant]}`}>
      <span className={textStyles}>{label}</span>
    </button>
  );
}

// [보조 컴포넌트] 통계 아이템 (구독 중 / 구독자)
function StatItem({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-[4px]">
      {/* Label: Gray-4 */}
      <span className="text-Gray-4 body_1_2 t:subhead_4_1">{label}</span>
      {/* Count: primary-1 */}
      <span className="text-primary-1 body_1_2 t:subhead_4_1">{count}</span>
    </div>
  );
}

export default function ProfileUserInfo({ nickname }: { nickname: string }) {
  return (
    <div
      className="flex flex-col items-center
      w-[339px] gap-[24px]
      t:w-[688px] t:gap-[40px] d:w-[734px]"
    >
      {/* 1. 상단 정보 섹션 (이미지 + 텍스트) */}
      <div
        className="flex w-full items-start
        flex-row gap-[24px]
        t:items-center t:gap-[38px]"
      >
        {/* 프로필 이미지 */}
        <div
          className="relative shrink-0 overflow-hidden rounded-full border border-Subbrown-3 bg-background
          h-[80px] w-[80px]
          t:h-[138px] t:w-[138px]"
        >
          <Image
            src="/profile.svg"
            alt={`${nickname}님의 프로필`}
            fill
            className="object-cover"
          />
        </div>

        {/* 텍스트 정보 영역 */}
        <div
          className="flex flex-col items-start
          w-[189px] gap-[12px]
          t:w-[512px] t:items-center d:w-[558px]"
        >
          {/* 닉네임 & 통계 */}
          <div className="flex w-full flex-col gap-[8px] items-start t:items-start">
            {/* 닉네임 */}
            <h1 className="text-Gray-7 subhead_3 t:subhead_1">{nickname}</h1>

            {/* 통계 그룹 */}
            <div className="flex items-center gap-[12px]">
              <StatItem label="구독 중" count={2} />
              <StatItem label="구독자" count={2} />
            </div>
          </div>

          {/* 소개글 */}
          <p className="w-full text-left break-keep text-Gray-4 body_2_3 t:body_1_2">
            이제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한 시간을
            시작해보세요. 한 권의 책이 주는 작은 울림이 일상에 큰 변화를
            가져올지도 모릅니다.
          </p>
        </div>
      </div>

      {/* 2. 하단 버튼 그룹 */}
      <div className="flex w-full justify-center items-center gap-[19px] t:gap-[24px]">
        <ActionButton variant="primary" label="구독하기" />
        <ActionButton variant="secondary" label="신고하기" />
      </div>
    </div>
  );
}
