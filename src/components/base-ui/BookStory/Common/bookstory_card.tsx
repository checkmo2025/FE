"use client";

import Image from "next/image";
import { formatTimeAgo } from "@/utils/time";
import { isValidUrl } from "@/utils/url";

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
  isFollowing?: boolean;
  hideSubscribeButton?: boolean;
  onClick?: () => void;
  onProfileClick?: () => void;
  layoutType?: "responsive" | "large-fixed";
};

export default function BookStoryCard({
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
  isFollowing = false,
  hideSubscribeButton = false,
  onClick,
  onProfileClick,
  layoutType = "responsive",
}: Props) {
  const heartIcon = likedByMe ? "/red_heart.svg" : "/gray_heart.svg";
  
  const isLargeFixed = layoutType === "large-fixed";

  return (
    <div
      onClick={onClick}
      className={`flex flex-col overflow-hidden rounded-lg border-2 border-Subbrown-4 bg-White hover:border-primary-2 transition-colors cursor-pointer
      ${isLargeFixed 
        ? "w-full max-w-[336px] h-[380px]" // 고정형 (기존 BookStoryCardLarge)
        : "w-[161px] h-[243px] md:w-full md:max-w-[336px] md:h-[380px]" // 반응형
      }`}
    >
      {/* 1. 상단 프로필 */}
      <div className={`items-center gap-2 px-4 py-3 ${isLargeFixed ? "flex" : "hidden md:flex"}`}>
        <div
          className="flex items-center gap-2 group cursor-pointer hover:bg-gray-100 transition-colors px-2 py-1 -ml-2 rounded-lg"
          onClick={(e) => {
            if (onProfileClick) {
              e.stopPropagation();
              onProfileClick();
            }
          }}
        >
          <div className="relative w-8 h-8 overflow-hidden rounded-full shrink-0">
            <Image
              src={isValidUrl(profileImgSrc) ? profileImgSrc : "/profile2.svg"}
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
        </div>
        <div className="flex-1" />
        {!hideSubscribeButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSubscribeClick?.();
            }}
            className={`h-8 rounded-lg px-[17px] body_2_1 whitespace-nowrap transition-all hover:brightness-90 active:scale-95 ${isFollowing
              ? "bg-Subbrown-4 text-primary-3"
              : "bg-primary-2 text-White"
              }`}
          >
            {subscribeText}
          </button>
        )}
      </div>

      {/* 2. 책 이미지 */}
      <div className={`relative w-full shrink-0 bg-Subbrown-4 overflow-hidden flex items-center justify-center ${isLargeFixed ? "h-36" : "flex-1 md:h-36 md:flex-none"}`}>
        {coverImgSrc && (
          <>
            <Image
              src={coverImgSrc}
              alt="cover background"
              fill
              className="object-cover opacity-50 blur-xl scale-125"
            />
            <div className="relative w-auto h-[90%] aspect-[2/3] shadow-sm z-10 transition-transform hover:scale-105">
              <Image src={coverImgSrc} alt="cover" fill className="object-contain" />
            </div>
          </>
        )}
      </div>

      {/* 3. 제목 + 내용 */}
      <div
        className={`flex flex-col ${isLargeFixed ? "px-4 pt-4" : "px-[16px] md:px-4 md:pt-4"}`}
      >
        {/* 제목 */}
        <p
          className={`text-Gray-7 truncate ${isLargeFixed
            ? "text-left subhead_2 pb-1"
            : "text-center mt-[12px] text-[14px] font-semibold leading-[145%] tracking-[-0.014px] md:text-left md:mt-0 md:subhead_2 md:pb-1"
          }`}
        >
          {title}
        </p>

        {/* 내용 */}
        <div
          className={`text-Gray-5 overflow-hidden ${isLargeFixed
            ? "h-16 pt-1 text-left body_1_3 line-clamp-3"
            : "mt-[4px] text-center text-[12px] font-medium leading-[145%] tracking-[-0.012px] line-clamp-2 md:line-clamp-3 md:block md:h-16 md:pt-1 md:text-left md:body_1_3"
          }`}
        >
          {content}
        </div>
      </div>

      {/* 4. 하단 통계 (좋아요/댓글) */}
      {/* 모바일 버전 Footer (responsive 타입일 때만) */}
      {!isLargeFixed && (
        <div className="flex md:hidden h-[37px] items-start border-t border-Subbrown-4 pt-[4px] pb-[12px]">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick?.(e);
            }}
            className="flex flex-1 items-center justify-center gap-[6px] border-r-2 border-Gray-2 h-[32px] hover:bg-gray-100 transition-colors"
          >
            <Image src={heartIcon} alt="좋아요" width={20} height={20} />
            <span className={`text-[12px] font-medium ${likedByMe ? 'text-primary-2' : 'text-Gray-4'}`}>
              {likeCount}
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-[6px] h-[32px]">
            <Image src="/comment.svg" alt="댓글" width={20} height={20} />
            <span className="text-[12px] font-medium text-Gray-4">
              {commentCount}
            </span>
          </div>
        </div>
      )}

      {/* 데스크탑 버전 Footer */}
      <div className={`${isLargeFixed ? "grid" : "hidden md:grid"} mt-1 grid-cols-[1fr_auto_1fr] items-center px-2 pb-[10px]`}>

        <div className="flex justify-center items-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick?.(e);
            }}
            className="flex items-center justify-center gap-2 pt-1 cursor-pointer hover:bg-gray-100 transition-colors rounded-full px-4 h-10"
          >
            <Image src={heartIcon} alt="좋아요" width={24} height={24} />
            <span className={`body_1_2 ${likedByMe ? 'text-primary-2' : 'text-Gray-4'}`}>좋아요 {likeCount}</span>
          </div>
        </div>
        <div className="h-10 w-[1.8px] mt-2 rounded-full bg-Gray-2" />
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 pt-1 px-4 h-10">
            <Image src="/comment.svg" alt="댓글" width={24} height={24} />
            <span className="body_1_2 text-Gray-4">댓글 {commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
