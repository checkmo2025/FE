import React from 'react';
import Image from 'next/image';

type ListSubscribeElementProps = {
  name: string;
  subscribingCount: number; // 구독중
  subscribersCount: number; // 구독자
  profileSrc?: string; // 기본: "/profile.svg" (public)
  onSubscribeClick?: () => void;
  buttonText?: string; // 기본: "구독"
};

export default function ListSubscribeElement({
  name,
  subscribingCount,
  subscribersCount,
  profileSrc = '/profile2.svg',
  onSubscribeClick,
  buttonText = '구독',
}: ListSubscribeElementProps) {
  return (
    <div className="flex w-full t:w-[296px] min-h-[60px] t:h-[66px] px-[14px] py-[8px] gap-[8px] rounded-[8px] border border-Subbrown-4 bg-white">
      <div className="w-[24px] h-[24px] t:w-[32px] t:h-[32px] rounded-full overflow-hidden shrink-0 relative self-center">
        <Image
          src={profileSrc}
          alt={`${name} profile`}
          fill
          className="object-cover"
          sizes="32px"
          priority={false}
        />
      </div>

      {/* 오른쪽 모바일(세로), 태블릿부터(가로) */}
      <div className="flex flex-col t:flex-row flex-1 min-w-0 gap-1 t:gap-[8px] t:items-center">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-Gray-7 body_2_1 t:body_1 truncate">{name}</p>
          <p className="body_2_3 t:text-Gray-3 hidden t:block">
            구독중 {subscribingCount} 구독자 {subscribersCount}
          </p>
        </div>

      {/* Button */}
      <button
        type="button"
        onClick={onSubscribeClick}
        className="hidden t:flex px-[10px] t:px-[17px] py-[6px] t:py-[8px] justify-center items-center gap-[10px] rounded-[8px] bg-[#9A7A6B] text-white text-[color:var(--White,#FFF)] text-[11px] t:text-[12px] font-semibold leading-[100%] tracking-[-0.012px] whitespace-nowrap shrink-0"
      >
        {buttonText}
      </button>
        {/* 모바일 버튼 */}
        <button
          type="button"
          onClick={onSubscribeClick}
          className="flex t:hidden w-full px-[17px] py-[6px] justify-center items-center rounded-[10px] bg-[#9A7A6B] text-white text-[11px] font-semibold leading-[100%] tracking-[-0.012px] whitespace-nowrap"
        >
          {buttonText}
        </button>

    </div>
  </div>
  );
}
