'use client';

import Image from 'next/image';
import React from 'react';

import DebateList from '@/components/base-ui/Bookcase/DebateList';
import LongtermChatInput from '@/components/base-ui/LongtermInput';

type DebateItem = {
  id: number;
  name: string;
  content: string;
  profileImageUrl?: string | null;
};

type Props = {
  // 내 정보
  myName: string;
  myProfileImageUrl?: string | null;
  defaultProfileUrl?: string; // "/profile4.svg"

  // 작성 토글/전송
  isWriting: boolean;
  onToggleWriting: () => void;
  onSendDebate: (text: string) => boolean | void;

  // 리스트
  items: DebateItem[];
};

export default function DebateSection({
  myName,
  myProfileImageUrl,
  defaultProfileUrl = '/profile4.svg',

  isWriting,
  onToggleWriting,
  onSendDebate,

  items,
}: Props) {
  const profileSrc = myProfileImageUrl || defaultProfileUrl;

  return (
    <div className="flex w-full flex-col items-start self-stretch">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between mb-7">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 shrink-0">
            <Image src="/Document.svg" alt="" fill className="object-contain" />
          </div>
          <p className="subhead_4_1 text-Gray-7">전체 발제</p>
        </div>

        <button
          type="button"
          onClick={onToggleWriting}
          className="relative w-6 h-6 shrink-0"
          aria-label="발제 작성 열기"
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
            flex items-center
            gap-3
            mb-[6px]
          "
        >
          {/* 프로필 + 이름 (가로) */}
          <div className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px]">
            <Image
              src={profileSrc}
              alt=""
              width={28}
              height={28}
              className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
            />
            <p className="text-Gray-7 body_1_2 d:subhead_4_1  truncate">
              {myName}
            </p>
          </div>

            

          {/* 입력 */}
          <div className="min-w-0 flex-1 flex items-start gap-3">

            {/* 입력: 내부에서 "글 뒤 20px + 전송버튼" 처리 */}
            <LongtermChatInput
              onSend={onSendDebate}
              placeholder="발제를 입력해 주세요"
              buttonIconSrc="/Send.svg"
            />
          </div>
        </div>
      )}

      {/* 리스트 */}
      <DebateList items={items} />
    </div>
  );
}
