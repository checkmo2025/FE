"use client";

import Image from "next/image";

type Props = {
  name: string;
  ProfileSrc?: string;
  createdAt: string;
  viewCount: number;
  CoverSrc?: string;
  title: string;
  content: string;
  likeCount?: number;
  commentCount?: number;
  onSubscribeClick?: () => void;
  buttonText?: string;
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
  name,
  ProfileSrc = "/profile2.svg",
  createdAt,
  viewCount,
  CoverSrc = "/bookstorycard.svg",
  title,
  content,
  likeCount = 1,
  commentCount = 1,
  onSubscribeClick,
  buttonText = "구독",
}: Props) {
  return (
    <div className="flex h-[380px] w-[336px] flex-col overflow-hidden rounded-lg border-2 border-[color:var(--Subbrown_4)] bg-white">
      {/* 상단 프로필 */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* 프로필 */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={ProfileSrc}
            alt={`${name} profile`}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>

        {/* 이름 + 시간 + 조회수 */}
        <div className="min-w-0 flex-1">
          <p className="Body_1 text-[color:var(--Gray_7)] truncate">{name}</p>
          <p className="Body_2_3 text-[color:var(--Gray_3)] truncate">
            {timeAgo(createdAt)} 조회수 {viewCount}
          </p>
        </div>

        {/* 구독 버튼 */}
        <button
          type="button"
          onClick={onSubscribeClick}
          className="h-8 rounded-lg bg-[color:var(--primary_2)] px-[17px] text-[12px] font-semibold leading-none text-white whitespace-nowrap"
        >
          {buttonText}
        </button>
      </div>

      {/* 책 이미지 */}
      <div className="relative h-36 w-full shrink-0 bg-[color:var(--Subbrown_4)] ">
        {CoverSrc && (
          <Image
            src={CoverSrc}
            alt="bookstory cover"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* 제목 + 내용 */}
      <div className="px-4 pt-4 ">
        <p className="text-xl font-semibold pb-1 leading-7 text-[color:var(--Gray_7)] ">
          {title}
        </p>
        <p className="self-stretch h-[76px] pt-1 justify-center text-[color:var(--Gray_5)] text-sm font-normal font-['Pretendard_Variable'] leading-5">
          {content}
        </p>
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
          <span className="text-[color:var(--Gray_4)] text-sm font-medium leading-5">
            좋아요 {likeCount}
          </span>
        </div>

        {/* 구분선 */}
        <div className="h-10 w-[1.8px] -mt-1 rounded-full bg-[color:var(--Gray_2)] " />

        {/* 댓글 */}
        <div className="flex items-center justify-center gap-2 pb-2">
          <Image src="/comment.svg" alt="댓글 아이콘" width={24} height={24} />
          <span className="text-[color:var(--Gray_4)] text-sm font-medium leading-5">
            댓글 {commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}
