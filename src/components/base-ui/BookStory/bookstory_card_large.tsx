"use client";

import Image from "next/image";
import { formatTimeAgo } from "@/utils/time";

type Props = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  createdAt: string;
  viewCount: number;
  coverImgSrc?: string;
  title: string;
  content: string;
  likeCount?: number;
  commentCount?: number;
  likedByMe?: boolean;
  onSubscribeClick?: () => void;
  onLikeClick?: (e: React.MouseEvent) => void;
  subscribeText?: string;
  onClick?: () => void;
  hideSubscribeButton?: boolean;
};

export default function BookStoryCardLarge({
  id,
  authorName,
  profileImgSrc = "/profile2.svg",
  createdAt,
  viewCount,
  coverImgSrc = "/bookstorycard.svg",
  title,
  content,
  likeCount = 0,
  commentCount = 0,
  likedByMe = false,
  onSubscribeClick,
  onLikeClick,
  subscribeText = "구독",
  onClick,
  hideSubscribeButton = false,
}: Props) {
  const heartIcon = likedByMe ? "/red_heart.svg" : "/gray_heart.svg";

  return (
    <div
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-lg border-2 border-Subbrown-4 bg-White hover:border-primary-2 transition-colors cursor-pointer
      w-[336px] h-[380px]"
    >
      {/* 상단 프로필 */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="relative w-8 h-8 overflow-hidden rounded-full shrink-0">
          <Image
            src={profileImgSrc}
            alt={authorName}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate body_1 text-Gray-7">{authorName}</p>
          <p className="truncate body_2_3 text-Gray-3">
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
            className="h-8 rounded-lg bg-primary-2 px-[17px] body_2_1 text-White whitespace-nowrap"
          >
            {subscribeText}
          </button>
        )}
      </div>

      {/* 책 이미지 */}
      <div className="relative w-full h-36 shrink-0 bg-Subbrown-4">
        {coverImgSrc && (
          <Image src={coverImgSrc} alt="cover" fill className="object-cover" />
        )}
      </div>

      {/* 제목 + 내용 */}
      <div className="flex flex-col px-4 pt-4">
        <p className="text-Gray-7 truncate text-left subhead_2 pb-1">
          {title}
        </p>
        <div className="text-Gray-5 overflow-hidden h-16 pt-1 text-left body_1_3 line-clamp-3">
          {content}
        </div>
      </div>

      {/* 좋아요/댓글 */}
      <div className="grid mt-1 grid-cols-[1fr_auto_1fr] items-center px-2 pb-[10px]">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onLikeClick?.(e);
          }}
          className="flex items-center justify-center gap-2 pt-1 cursor-pointer hover:bg-gray-50 transition-colors rounded-sm"
        >
          <Image src={heartIcon} alt="좋아요" width={24} height={24} />
          <span className={`body_1_2 ${likedByMe ? 'text-primary-2' : 'text-Gray-4'}`}>좋아요 {likeCount}</span>
        </div>
        <div className="h-10 w-[1.8px] mt-2 rounded-full bg-Gray-2" />
        <div className="flex items-center justify-center gap-2 pt-1">
          <Image src="/comment.svg" alt="댓글" width={24} height={24} />
          <span className="body_1_2 text-Gray-4">댓글 {commentCount}</span>
        </div>
      </div>
    </div>
  );
}
