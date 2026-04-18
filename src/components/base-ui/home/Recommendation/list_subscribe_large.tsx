'use client';

import Image from 'next/image';
import { isValidUrl } from '@/utils/url';

type ListSubscribeElementLargeProps = {
  name: string;
  subscribingCount?: number;
  subscribersCount?: number;
  profileSrc?: string;
  onProfileClick?: () => void;
  onSubscribeClick?: () => void;
  buttonText?: string;
  isFollowing?: boolean;
};

function ListSubscribeElementLarge({
  name,
  subscribingCount,
  subscribersCount,
  profileSrc = '/profile2.svg',
  onProfileClick,
  onSubscribeClick,
  buttonText = '구독',
  isFollowing = false,
}: ListSubscribeElementLargeProps) {
  return (
    <div
      className={`flex w-[296px] h-[66px] px-[14px] py-[8px] gap-[8px] rounded-[8px] border border-Subbrown-4 bg-white transition-colors group ${onProfileClick ? "cursor-pointer hover:bg-stone-100" : ""}`}
      onClick={onProfileClick}
      role={onProfileClick ? "button" : undefined}
      tabIndex={onProfileClick ? 0 : -1}
    >
      <div className="w-[32px] h-[32px] rounded-full overflow-hidden shrink-0 relative self-center">
        <Image
          src={isValidUrl(profileSrc) ? profileSrc : '/profile2.svg'}
          alt={`${name} profile`}
          fill
          className="object-cover"
          sizes="32px"
          priority={false}
        />
      </div>

      <div className="flex flex-row flex-1 min-w-0 gap-[8px] items-center">
        <div className="flex flex-col min-w-0 flex-1">
          <p className={`text-Gray-7 body_1 truncate ${onProfileClick ? "group-hover:underline" : ""}`}>{name}</p>
          {subscribingCount !== undefined && subscribersCount !== undefined && (
            <p className="body_2_3 text-Gray-3">
              구독중 {subscribingCount} 구독자 {subscribersCount}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSubscribeClick?.(); }}
          className={`flex px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] text-[12px] font-semibold leading-[100%] tracking-[-0.012px] whitespace-nowrap shrink-0 transition-colors ${isFollowing
            ? "bg-Subbrown-4 text-primary-3"
            : "bg-primary-2 text-white"
            }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

type ListSubscribeLargeProps = {
  height?: string;
  users?: Array<{
    nickname: string;
    profileImageUrl?: string;
    subscribingCount?: number;
    subscribersCount?: number;
    isFollowing?: boolean;
  }>;
  isError?: boolean;
  isLoading?: boolean;
  onProfileClick?: (nickname: string) => void;
  onSubscribeClick?: (nickname: string, isFollowing: boolean) => void;
};

export default function ListSubscribeLarge({
  height = "h-[380px]",
  users = [],
  isError = false,
  isLoading = false,
  onProfileClick,
  onSubscribeClick,
}: ListSubscribeLargeProps) {

  return (
    <section
      className={`w-[336px] ${height} rounded-lg border-2 border-Subbrown-4 bg-stone-50 p-5`}
    >
      <h3 className="subhead_2 text-Gray-7">사용자 추천</h3>

      <div className="mt-3 flex flex-col gap-3 h-full">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center pt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
          </div>
        )}
        {isError && !isLoading && (
          <div className="flex flex-1 items-center justify-center pt-10">
            <p className="text-Gray-4 text-[14px] text-center">추천 목록을 불러오지 못했어요.</p>
          </div>
        )}
        {!isError && !isLoading && users.length === 0 && (
          <div className="flex flex-1 items-center justify-center pt-10">
            <p className="text-Gray-4 text-[14px] text-center">사용자 추천이 없습니다.</p>
          </div>
        )}
        {!isError && !isLoading && users.length > 0 &&
          users.map((u) => (
            <ListSubscribeElementLarge
              key={u.nickname}
              name={u.nickname}
              subscribingCount={u.subscribingCount}
              subscribersCount={u.subscribersCount}
              profileSrc={u.profileImageUrl}
              isFollowing={u.isFollowing}
              buttonText={u.isFollowing ? "구독중" : "구독"}
              onProfileClick={() => onProfileClick?.(u.nickname)}
              onSubscribeClick={() => onSubscribeClick?.(u.nickname, u.isFollowing || false)}
            />
          ))}
      </div>
    </section>
  );
}
