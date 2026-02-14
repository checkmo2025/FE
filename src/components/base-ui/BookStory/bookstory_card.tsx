"use client";

import Image from "next/image";

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
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function BookStoryCard({
  authorName,
  profileImgSrc = "/profile2.svg",
  createdAt,
  viewCount,
  coverImgSrc = "/bookstorycard.svg",
  title,
  content,
  likeCount = 1,
  commentCount = 1,
  onSubscribeClick,
  subscribeText = "구독",
}: Props) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg border-2 border-Subbrown-4 bg-White hover:border-primary-2 transition-colors
      /* 모바일: 161px x 243px */
      w-[161px] h-[243px]
      /* 데스크탑(md 이상): 336px x 380px */
      md:w-[336px] md:h-[380px]"
    >
      {/* 1. 상단 프로필 (모바일 숨김 / 데스크탑 노출) */}
      <div className="items-center hidden gap-2 px-4 py-3 md:flex">
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
            {timeAgo(createdAt)} 조회수 {viewCount}
          </p>
        </div>
        <button
          type="button"
          onClick={onSubscribeClick}
          className="h-8 rounded-lg bg-primary-2 px-[17px] body_2_1 text-White whitespace-nowrap"
        >
          {subscribeText}
        </button>
      </div>

      {/* 2. 책 이미지 (모바일: flex-1 / 데스크탑: h-36) */}
      <div className="relative flex-1 w-full shrink-0 bg-Subbrown-4 md:h-36 md:flex-none">
        {coverImgSrc && (
          <Image src={coverImgSrc} alt="cover" fill className="object-cover" />
        )}
      </div>

      {/* 3. 제목 + 내용 */}
      <div
        className="flex flex-col
        px-[16px] md:px-4 md:pt-4"
      >
        {/* 제목 */}
        <p
          className="text-Gray-7 truncate
          /* 모바일: 중앙 정렬, mt-3, 14px */
          text-center mt-[12px] text-[14px] font-semibold leading-[145%] tracking-[-0.014px]
          /* 데스크탑: 좌측 정렬, subhead_2 */
          md:text-left md:mt-0 md:subhead_2 md:pb-1"
        >
          {title}
        </p>

        {/* 내용 */}
        <div
          className="text-Gray-5 overflow-hidden
          /* 모바일: h-[76px], flex center, 12px */
          flex flex-col justify-center h-[76px] text-center text-[12px] font-medium leading-[145%] tracking-[-0.012px] line-clamp-3
          /* 데스크탑: h-16, block, body_1_3 */
          md:block md:h-16 md:pt-1 md:text-left md:body_1_3"
        >
          {content}
        </div>
      </div>

      {/* 4. 하단 통계 (좋아요/댓글) */}
      {/* 모바일 버전 Footer */}
      <div className="flex md:hidden h-[37px] items-start border-t border-Subbrown-4 pt-[4px] pb-[12px]">
        <div className="flex flex-1 items-center justify-center gap-[6px] border-r-2 border-Gray-2 h-[32px]">
          <Image src="/gray_heart.svg" alt="좋아요" width={20} height={20} />
          <span className="text-[12px] font-medium text-Gray-4">
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

      {/* 데스크탑 버전 Footer */}
      <div className="hidden md:grid mt-1 grid-cols-[1fr_auto_1fr] items-center px-2 pb-[10px]">
        <div className="flex items-center justify-center gap-2 pt-1">
          <Image src="/gray_heart.svg" alt="좋아요" width={24} height={24} />
          <span className="body_1_2 text-Gray-4">좋아요 {likeCount}</span>
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
