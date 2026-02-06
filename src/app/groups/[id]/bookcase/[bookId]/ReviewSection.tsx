'use client';

import Image from 'next/image';
import React, { useState } from 'react';


import LongtermChatInput from '@/components/base-ui/LongtermInput';
import ReviewList, { ReviewItem } from '@/components/base-ui/Bookcase/bookid/ReviewList';
import { StarSelector } from '@/components/base-ui/Bookcase/bookid/StarRating';



type Props = {
  myName: string;
  myProfileImageUrl?: string | null;
  defaultProfileUrl?: string;

  isWriting: boolean;
  onToggleWriting: () => void;

  // 별점까지 같이 보냄
  onSendReview: (text: string, rating: number) => boolean | void;

  items: ReviewItem[];
  onClickMore?: (id: ReviewItem['id']) => void;
};


export default function ReviewSection({
  myName,
  myProfileImageUrl,
  defaultProfileUrl = '/profile4.svg',

  isWriting,
  onToggleWriting,
  onSendReview,

  items,
  onClickMore,
}: Props) {
  const profileSrc = myProfileImageUrl || defaultProfileUrl;

  const [newRating, setNewRating] = useState<number>(0);

  const handleSend = (text: string) => {
    // (6,7 느낌) 별점 최소 1점
    if (newRating < 1) return false;

    const ok = onSendReview(text, newRating);
    if (ok !== false) setNewRating(0);
    return ok;
  };

  return (
    <div className="flex w-full flex-col items-start self-stretch">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between mb-7">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 shrink-0 text-Gray-7">
            <Image
              src="/Star.svg" 
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="subhead_4_1 text-Gray-7">한줄평</p>
        </div>

        <button
          type="button"
          onClick={onToggleWriting}
          className="relative w-6 h-6 shrink-0"
          aria-label="한줄평 작성 열기"
        >
          <Image src="/icon_plus_1.svg" alt="" fill className="object-contain" />
        </button>
      </div>

      {/* 작성칸 */}
      {isWriting && (
        <div
          className="
            w-full rounded-[8px]
            border border-Subbrown-4
            bg-White
            px-5 py-3
            flex flex-col
            gap-3
            mb-[6px]
            t:flex-row t:items-center
          "
        >
          {/* (모바일) 프로필+이름 / 별점은 한 덩어리로 보이게 */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 t:flex t:items-center t:gap-3 t:shrink-0">
            <div className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px]">
              <Image
                src={profileSrc}
                alt=""
                width={28}
                height={28}
                className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
              />
              <p className="text-Gray-7 body_1_2 d:subhead_4_1 truncate">{myName}</p>
            </div>

            <StarSelector
              value={newRating}
              onChange={setNewRating}
              className="justify-self-start"
              starClassName="w-[16px] h-[16px] t:w-[18px] t:h-[18px] d:w-[20px] d:h-[20px]"
            />
          </div>

          {/* 입력 */}
          <div className="min-w-0 flex-1">
            <LongtermChatInput
              onSend={handleSend}
              placeholder="한줄평을 입력해 주세요"
              buttonIconSrc="/Send.svg"
            />
          </div>
        </div>
      )}

      {/* 리스트 */}
      <ReviewList items={items} onClickMore={onClickMore} />
    </div>
  );
}
