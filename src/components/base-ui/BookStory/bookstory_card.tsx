'use client';

import Image from 'next/image';

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

  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function BookStoryCard({
  authorName,
  profileImgSrc = '/profile2.svg',
  createdAt,
  viewCount,
  coverImgSrc = '/bookstorycard.svg',
  title,
  content,
  likeCount = 1,
  commentCount = 1,
  onSubscribeClick,
  subscribeText = '구독',
}: Props) {
  return (
    <div className="flex h-[380px] w-[336px] flex-col overflow-hidden rounded-lg border-2 border-Subbrown-4 bg-White">
      {/* 상단 프로필 */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* 프로필 */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={profileImgSrc}
            alt={`${authorName} profile`}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>

        {/* 이름 + 시간 + 조회수 */}
        <div className="min-w-0 flex-1">
          <p className="body_1 text-Gray-7 truncate">{authorName}</p>
          <p className="body_2_3 text-Gray-3 truncate">
            {timeAgo(createdAt)} 조회수 {viewCount}
          </p>
        </div>

        {/* 구독 버튼 */}
        <button
          type="button"
          onClick={onSubscribeClick}
          className="h-8 rounded-lg bg-primary-2 px-[17px] body_2_1 text-White whitespace-nowrap"
        >
          {subscribeText}
        </button>
      </div>

      {/* 책 이미지 */}
      <div className="relative h-36 w-full shrink-0 bg-Subbrown-4">
        {coverImgSrc && (
          <Image
            src={coverImgSrc}
            alt="bookstory cover"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* 제목 + 내용 */}
      <div className="px-4 pt-4 ">
        <p className="subhead_2 pb-1 text-Gray-7">{title}</p>
        <p className="body_1_3 h-[76px] pt-1 text-Gray-5">{content}</p>
      </div>

      {/* 좋아요 + 댓글 */}
      <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center px-2">
        {/* 좋아요 */}
        <div className="flex items-center justify-center gap-2 pb-2">
          <Image
            src="/blank_heart.svg"
            alt="좋아요 아이콘"
            width={24}
            height={24}
          />
          <span className="body_1_2 text-Gray-4">좋아요 {likeCount}</span>
        </div>

        {/* 구분선 */}
        <div className="h-10 w-[1.8px] -mt-1 rounded-full bg-Gray-2" />

        {/* 댓글 */}
        <div className="flex items-center justify-center gap-2 pb-2">
          <Image src="/comment.svg" alt="댓글 아이콘" width={24} height={24} />
          <span className="body_1_2 text-Gray-4">댓글 {commentCount}</span>
        </div>
      </div>
    </div>
  );
}
