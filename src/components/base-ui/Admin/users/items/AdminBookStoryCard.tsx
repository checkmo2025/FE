"use client";

import Image from "next/image";
import { formatTimeAgo } from "@/utils/time";
import { isValidUrl } from "@/utils/url";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

type Props = {
  authorName: string;
  profileImgSrc?: string;
  createdAt: string;
  viewCount: number;
  coverImgSrc?: string;
  title: string;
  content: string;
  likeCount?: number;
  commentCount?: number;

  onSubscribeClick?: () => void;
  subscribeText?: string;
  hideSubscribeButton?: boolean;

  onDeleteClick?: () => void;
  hideDeleteButton?: boolean;

  onClick?: () => void;
};

export default function BookStoryCard({
  authorName,
  profileImgSrc = DEFAULT_PROFILE_IMAGE,
  createdAt,
  viewCount,
  coverImgSrc = "/bookstorycard.svg",
  title,
  content,
  likeCount = 1,
  commentCount = 1,
  onSubscribeClick,
  subscribeText = "구독",
  hideSubscribeButton = false,
  onDeleteClick,
  hideDeleteButton = false,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
        relative flex flex-col overflow-hidden rounded-lg
        border-2 border-Subbrown-4 bg-White
        transition-colors hover:border-primary-2
        cursor-pointer
        w-[161px] h-[243px]
        md:w-[336px] md:h-[380px]
      "
    >
      {/* 우측 상단 삭제 버튼 */}
      {!hideDeleteButton && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick?.();
          }}
          className="
            absolute right-[12px] top-[12px] z-10
            rounded-[8px] bg-Red px-[14px] py-[6px]
            caption_1_2 text-White
            hover:opacity-90 transition
          "
        >
          삭제
        </button>
      )}

      {/* 1. 상단 프로필 (모바일 숨김 / 데스크탑 노출) */}
      <div className="hidden items-center gap-2 px-4 py-3 md:flex">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={isValidUrl(profileImgSrc) ? profileImgSrc : DEFAULT_PROFILE_IMAGE}
            alt={authorName}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="body_1 truncate text-Gray-7">{authorName}</p>
          <p className="body_2_3 truncate text-Gray-3">
            {formatTimeAgo(createdAt)} 조회수 {viewCount}
          </p>
        </div>

        {!hideSubscribeButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSubscribeClick?.();
            }}
            className="h-8 whitespace-nowrap rounded-lg bg-primary-2 px-[17px] body_2_1 text-White"
          >
            {subscribeText}
          </button>
        )}
      </div>

      {/* 2. 책 이미지 (모바일: flex-1 / 데스크탑: h-36) */}
      <div className="relative flex-1 w-full shrink-0 bg-Subbrown-4 md:h-36 md:flex-none">
        {coverImgSrc && (
          <Image src={coverImgSrc} alt="cover" fill className="object-cover" />
        )}
      </div>

      {/* 3. 제목 + 내용 */}
      <div className="flex flex-col px-[16px] md:px-4 md:pt-4">
        {/* 제목 */}
        <p
          className="
            truncate text-Gray-7
            text-center mt-[12px] body_1_1
            md:text-left md:mt-0 md:subhead_2 md:pb-1
          "
        >
          {title}
        </p>

        {/* 내용 */}
        <div
          className="
            overflow-hidden text-Gray-5
            mt-[4px] text-center body_2_2
            line-clamp-2 md:line-clamp-3
            md:block md:h-16 md:pt-1 md:text-left md:body_1_3
          "
        >
          {content}
        </div>
      </div>

      {/* 4. 하단 통계 (좋아요/댓글) */}
      {/* 모바일 Footer */}
      <div className="flex h-[37px] items-start border-t border-Subbrown-4 pt-[4px] pb-[12px] md:hidden">
        <div className="flex h-[32px] flex-1 items-center justify-center gap-[6px] border-r-2 border-Gray-2">
          <Image src="/gray_heart.svg" alt="좋아요" width={20} height={20} />
          <span className="body_2_2 text-Gray-4">{likeCount}</span>
        </div>
        <div className="flex h-[32px] flex-1 items-center justify-center gap-[6px]">
          <Image src="/comment.svg" alt="댓글" width={20} height={20} />
          <span className="body_2_2 text-Gray-4">{commentCount}</span>
        </div>
      </div>

      {/* 데스크탑 Footer */}
      <div className="mt-1 hidden grid-cols-[1fr_auto_1fr] items-center px-2 pb-[10px] md:grid">
        <div className="flex items-center justify-center gap-2 pt-1">
          <Image src="/gray_heart.svg" alt="좋아요" width={24} height={24} />
          <span className="body_1_2 text-Gray-4">좋아요 {likeCount}</span>
        </div>
        <div className="mt-2 h-10 w-[1.8px] rounded-full bg-Gray-2" />
        <div className="flex items-center justify-center gap-2 pt-1">
          <Image src="/comment.svg" alt="댓글" width={24} height={24} />
          <span className="body_1_2 text-Gray-4">댓글 {commentCount}</span>
        </div>
      </div>
    </div>
  );
}