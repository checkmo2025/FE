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
    <div className="flex w-[296px] h-[66px] px-[14px] py-[8px] items-center gap-[8px] rounded-[8px] border border-[var(--Subbrown_4)] bg-white">
      {/* Profile */}
      <div className="w-[32px] h-[32px] rounded-full overflow-hidden shrink-0 relative">
        <Image
          src={profileSrc}
          alt={`${name} profile`}
          fill
          className="object-cover"
          sizes="42px"
          priority={false}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-[color:var(--Gray_7)] body_1 ">{name}</p>
        <p className="text-[color:var(--Gray_3)] body_2_3">
          구독중 {subscribingCount} 구독자 {subscribersCount}
        </p>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={onSubscribeClick}
        className="flex px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] bg-[#9A7A6B] text-white text-[color:var(--White,#FFF)] text-[12px] font-semibold leading-[100%] tracking-[-0.012px] whitespace-nowrap"
      >
        {buttonText}
      </button>
    </div>
  );
}
