"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

import LongtermChatInput from "@/components/base-ui/LongtermInput";
import ReviewList, { ReviewItem } from "@/components/base-ui/Bookcase/bookid/ReviewList";
import { StarSelector } from "@/components/base-ui/Bookcase/bookid/StarRating";
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

  onSendReview: (text: string, rating: number) => boolean | void;

  items: ReviewItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void | Promise<unknown>;

  onReport: (id: ReviewItem["id"]) => void;
  onUpdate: (id: ReviewItem["id"], nextContent: string, nextRating: number) => void;
  onDelete: (id: ReviewItem["id"]) => void;

  onClickAuthor?: (name: string) => void;
};

export default function ReviewSection({
  myName,
  myProfileImageUrl,
  defaultProfileUrl,

  isStaff,

  isWriting,
  onToggleWriting,
  onSendReview,

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
  const [newRating, setNewRating] = useState<number>(0);
  const [draftText, setDraftText] = useState("");
  const { confirmNavigation } = useUnsavedChangesGuard({
    isDirty: isWriting && (Boolean(draftText.trim()) || newRating >= 0.5),
    variant: "create",
    title: "작성 중인 한줄평이 있어요",
    description: "이 화면을 나가면 입력한 한줄평이 저장되지 않습니다.",
  });

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "300px 0px",
  });

  useEffect(() => {
    if (!inView) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    onLoadMore();
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  const handleToggleWriting = () => {
    if (isWriting && (draftText.trim() || newRating >= 0.5)) {
      confirmNavigation(
        () => {
          setDraftText("");
          setNewRating(0);
          onToggleWriting();
        },
        {
          title: "작성 중인 한줄평이 있어요",
          description: "한줄평 작성을 취소하면 입력한 내용이 사라집니다.",
          leaveText: "취소하기",
          stayText: "계속 작성",
        }
      );
      return;
    }

    onToggleWriting();
  };

  const handleSend = (text: string) => {
    if (newRating < 0.5) {
      toast.error("별점을 선택해 주세요.");
      return false;
    }
    const ok = onSendReview(text, newRating);
    if (ok !== false) setNewRating(0);
    return ok;
  };

  return (
    <div className="flex w-full flex-col items-start self-stretch">
      <div className="w-full flex items-center justify-between mb-7">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 shrink-0 text-Gray-7">
            <Image src="/Star.svg" alt="" fill className="object-contain" priority />
          </div>
          <p className="subhead_4_1 text-Gray-7">한줄평</p>
        </div>

        <button
          type="button"
          onClick={handleToggleWriting}
          className="relative w-6 h-6 shrink-0 hover:brightness-0 cursor-pointer"
          aria-label="한줄평 작성 열기"
        >
          <Image src="/icon_plus_1.svg" alt="" fill className="object-contain" />
        </button>
      </div>

      {isWriting && (
        <div
          className="
            w-full rounded-[8px]
            border border-Subbrown-4
            bg-White
            px-5 py-3
            flex flex-col
            t:gap-3
            mb-[6px]
            t:flex-row t:items-center
          "
        >
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 t:flex t:items-center t:gap-1 t:shrink-0">
            <div className="flex shrink-0 items-center gap-3 t:min-w-[128px] d:min-w-[178px] hover:brightness-95 cursor-pointer">
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
              starClassName="w-[16px] h-[16px] t:w-[18px] t:h-[18px] d:w-[20px] d:h-[20px] cursor-pointer"
            />
          </div>

          <div className="min-w-0 flex-1">
            <LongtermChatInput
              onSend={handleSend}
              onDraftChange={setDraftText}
              placeholder="한줄평을 입력해 주세요"
              buttonIconSrc="/Send.svg"
              maxLength={INPUT_LIMITS.BOOKSHELF_COMPOSER}
              overLimitMessage={`한줄평은 ${INPUT_LIMITS.BOOKSHELF_COMPOSER}자 이하여야 합니다.`}
            />
          </div>
        </div>
      )}

      <ReviewList
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
          {isFetchingNextPage ? "한줄평을 더 불러오는 중..." : ""}
        </div>
      )}
    </div>
  );
}
