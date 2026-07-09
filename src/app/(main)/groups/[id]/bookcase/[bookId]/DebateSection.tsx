"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import LongtermChatInput from "@/components/base-ui/LongtermInput";
import DebateList, { DebateItem } from "@/components/base-ui/Group/DebateList";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import { getProfileImageSrc } from "@/utils/profileImage";

type Props = {
  myName: string;
  myProfileImageUrl?: string | null;
  defaultProfileUrl?: string;

  isStaff: boolean;

  isWriting: boolean;
  onToggleWriting: () => void;
  onSendDebate: (text: string) => boolean | void;

  items: DebateItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void | Promise<unknown>;

  onReport: (id: DebateItem["id"]) => void;
  onUpdate: (id: DebateItem["id"], nextContent: string) => void;
  onDelete: (id: DebateItem["id"]) => void;

  onClickAuthor?: (name: string) => void;
};

export default function DebateSection({
  myName,
  myProfileImageUrl,
  defaultProfileUrl,

  isStaff,

  isWriting,
  onToggleWriting,
  onSendDebate,

  items,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,

  onReport,
  onUpdate,
  onDelete,

  onClickAuthor,
}: Props) {
  const profileSrc = getProfileImageSrc(myProfileImageUrl ?? defaultProfileUrl);
  const [draftText, setDraftText] = useState("");
  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "300px 0px",
  });
  const { confirmNavigation } = useUnsavedChangesGuard({
    isDirty: isWriting && Boolean(draftText.trim()),
    variant: "create",
    title: "작성 중인 발제가 있어요",
    description: "이 화면을 나가면 입력한 발제가 저장되지 않습니다.",
  });

  useEffect(() => {
    if (!inView) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    onLoadMore();
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  const handleToggleWriting = () => {
    if (isWriting && draftText.trim()) {
      confirmNavigation(
        () => {
          setDraftText("");
          onToggleWriting();
        },
        {
          title: "작성 중인 발제가 있어요",
          description: "발제 작성을 취소하면 입력한 내용이 사라집니다.",
          leaveText: "취소하기",
          stayText: "계속 작성",
        }
      );
      return;
    }

    onToggleWriting();
  };

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
          onClick={handleToggleWriting}
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
              onDraftChange={setDraftText}
              placeholder="발제를 입력해 주세요"
              buttonIconSrc="/Send.svg"
              maxLength={INPUT_LIMITS.BOOKSHELF_COMPOSER}
              overLimitMessage={`발제는 ${INPUT_LIMITS.BOOKSHELF_COMPOSER}자 이하여야 합니다.`}
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

      {(hasNextPage || isFetchingNextPage) && (
        <div
          ref={loadMoreRef}
          className="flex w-full items-center justify-center py-4 text-Gray-4 body_2_3"
        >
          {isFetchingNextPage ? "발제를 더 불러오는 중..." : ""}
        </div>
      )}
    </div>
  );
}
