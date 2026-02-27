"use client";

import Image from "next/image";
import React from "react";

import LongtermChatInput from "@/components/base-ui/LongtermInput";
import DebateList, { DebateItem } from "@/components/base-ui/Group/DebateList";

type Props = {
  myName: string;
  myProfileImageUrl?: string | null;
  defaultProfileUrl?: string;

  isStaff: boolean;

  isWriting: boolean;
  onToggleWriting: () => void;
  onSendDebate: (text: string) => boolean | void;

  items: DebateItem[];

  onReport: (id: DebateItem["id"]) => void;
  onUpdate: (id: DebateItem["id"], nextContent: string) => void;
  onDelete: (id: DebateItem["id"]) => void;

  onClickAuthor?: (name: string) => void;
};

export default function DebateSection({
  myName,
  myProfileImageUrl,
  defaultProfileUrl = "/profile4.svg",

  isStaff,

  isWriting,
  onToggleWriting,
  onSendDebate,

  items,

  onReport,
  onUpdate,
  onDelete,

  onClickAuthor,
}: Props) {
  const profileSrc = myProfileImageUrl || defaultProfileUrl;

  return (
    <div className="flex w-full flex-col items-start self-stretch">
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
          className="relative w-6 h-6 shrink-0 hover:brightness-50 cursor-pointer"
          aria-label="발제 작성 열기"
        >
          <Image src="/icon_plus_1.svg" alt="" fill className="object-contain" />
        </button>
      </div>

      {isWriting && (
        <div className="w-full rounded-[8px] border border-Subbrown-4 bg-White px-5 py-3 flex items-center gap-3 mb-[6px]">
          <div className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px] hover:brightness-95 cursor-pointer">
            <Image
              src={profileSrc}
              alt=""
              width={28}
              height={28}
              className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
            />
            <p className="text-Gray-7 body_1_2 d:subhead_4_1 truncate">{myName}</p>
          </div>

          <div className="min-w-0 flex-1 flex items-start gap-3">
            <LongtermChatInput
              onSend={onSendDebate}
              placeholder="발제를 입력해 주세요"
              buttonIconSrc="/Send.svg"
            />
          </div>
        </div>
      )}

      <DebateList
        items={items}
        isStaff={isStaff}
        onReport={onReport}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onClickAuthor={onClickAuthor}
      />
    </div>
  );
}