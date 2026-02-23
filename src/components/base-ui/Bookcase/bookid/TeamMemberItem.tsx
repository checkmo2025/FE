"use client";

import Image from "next/image";

type Props = {
  name: string;
  profileImageUrl?: string;
  onMoreClick?: () => void;
};

export default function TeamMemberItem({
  name,
  profileImageUrl,
  onMoreClick,
}: Props) {
  return (
    <div className="flex w-full items-center justify-between rounded-[8px] border border-Subbrown-4 bg-background px-[20px] py-[12px]">
      {/* 왼쪽: 프로필 + 이름 */}
      <div className="flex items-center gap-[12px] hover:brightness-95 cursor-pointer">
        {/* 프로필 이미지 (임시 원형 플레이스홀더) */}
        <div className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-Gray-2">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            // 이미지가 없을 경우 기본 아이콘 혹은 회색 배경
            <div className="w-full h-full bg-Gray-3" />
          )}
        </div>

        {/* 이름 */}
        <span className="text-Gray-7 subhead_4_1">{name}</span>
      </div>

      {/* 오른쪽: 더보기 버튼 */}
      <button
        onClick={onMoreClick}
        className="relative h-[24px] w-[24px] shrink-0 hover:brightness-0 cursor-pointer"
      >
        <Image
          src="/ant-design_more-outlined.svg"
          alt="더보기"
          fill
          className="object-contain"
        />
      </button>
    </div>
  );
}
