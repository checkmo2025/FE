"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type BookstoryDetailProps = {
  imageUrl?: string;

  authorName: string;
  authorNickname: string;
  authorId: string | number;

  profileImgSrc?: string; // 기본: "/profile.svg"
  subscribeText?: string; // 기본: "구독"
  onSubscribeClick?: () => void;

  bookTitle: string;
  bookAuthor: string;
  bookDetail?: string;

  createdAt: string;
  viewCount: number;
  likeCount?: number;

  authorHref?: string; // 기본: `/profile/${authorId}`
  className?: string;
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

export default function BookstoryDetail({
  imageUrl = "/bookstory_example.svg",
  authorName,
  authorNickname,
  authorId,
  profileImgSrc = "/profile2.svg",
  subscribeText = "구독",
  onSubscribeClick,
  bookTitle,
  bookAuthor,
  bookDetail,
  createdAt,
  viewCount,
  likeCount = 1,
  authorHref,
  className = "",
}: BookstoryDetailProps) {
  const href = authorHref ?? `/profile/${authorId}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`flex flex-col t:flex-row w-full px-[20px] items-start gap-4 t:gap-[28px] bg-Background ${className}`}
    >
      {/* 모바일: 시간/조회수 */}
      <div className="flex t:hidden items-center gap-2 w-full">
        <span className="body_2_2 text-Gray-3">{timeAgo(createdAt)}</span>
        <span className="body_2_2 text-Gray-3">조회수 {viewCount}</span>
      </div>

      {/* 모바일: 프로필 + 구독 */}
      <div className="flex t:hidden items-center justify-between w-full">
        {/* 프로필 */}
        <Link href={href} className="flex items-center gap-[12px] min-w-0">
          <div className="relative w-[32px] h-[32px] shrink-0 rounded-full overflow-hidden">
            <Image
              src={profileImgSrc}
              alt={authorName}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <p className="text-Gray-7 body_1_1 truncate">{authorNickname}</p>
        </Link>

        {/* 구독 */}
        <button
          type="button"
          onClick={onSubscribeClick}
          className="flex px-4 py-1.5 justify-center items-center rounded-lg bg-primary-2 text-White text-[12px] font-medium shrink-0"
        >
          {subscribeText}
        </button>
      </div>

      {/* 모바일: 책 제목 + 햄버거 */}
      <div className="flex t:hidden items-start justify-between w-full">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="text-Gray-7 subhead_3_1 truncate">{bookTitle}</p>
          <p className="text-Gray-4 body_1_2 truncate">{bookAuthor}</p>
        </div>

        {/* 햄버거 */}
        <div className="relative shrink-0 ml-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            <Image src="/menu_dots.svg" alt="메뉴" width={24} height={24} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-34 h-22 rounded-lg bg-White z-10 px-2 shadow-md">
              <button
                type="button"
                onClick={() => {
                  console.log("신고하기");
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
              >
                <Image src="/report.svg" alt="신고" width={20} height={20} />
                신고하기
              </button>
              <div className="mx-2 border-b border-Subbrown-4" />
              <button
                type="button"
                onClick={() => {
                  console.log("공유하기");
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
              >
                <Image
                  src="/gray_share.svg"
                  alt="공유"
                  width={20}
                  height={20}
                />
                공유하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 모바일: 이미지 + 좋아요/공유 */}
      <div className="flex t:hidden justify-between gap-4 w-full">
        {/* 이미지 */}
        <div className="relative w-[106px] h-[130px] shrink-0">
          <Image src={imageUrl} alt={bookTitle} fill className="object-cover" />
        </div>

        {/* 좋아요/공유 */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Image src="/gray_heart.svg" alt="heart" width={20} height={20} />
            <span className="body_1_2 text-Gray-5">좋아요 {likeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/share.svg" alt="share" width={20} height={20} />
            <span className="body_1_2 text-Gray-5">공유하기</span>
          </div>
        </div>
      </div>

      {/* 태블릿부터 이미지 */}
      <div className="relative hidden t:block t:ml-[20px] d:ml-[130px] t:w-[282px] t:h-[344px] shrink-0">
        <Image
          src={imageUrl}
          alt={bookTitle}
          fill
          className="object-cover"
          sizes="282px"
        />
      </div>

      {/* 태블릿부터: 오른쪽 정보 영역 */}
      <div className="relative hidden t:flex flex-1 min-w-0 h-[344px] justify-between">
        {/* 닉네임 + 제목/저자 + 좋아요/공유 */}
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* 닉네임 */}
            <Link href={href} className="flex items-center gap-[12px] min-w-0">
              <div className="relative w-[32px] h-[32px] shrink-0 rounded-full overflow-hidden">
                <Image
                  src={profileImgSrc}
                  alt={authorName}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <p className="text-Gray-7 subhead_4_1 truncate">
                {authorNickname}
              </p>
            </Link>

            {/* 제목/저자 */}
            <div className="flex flex-col gap-2 min-w-0 mt-4">
              <p className="text-Gray-7 subhead_1 truncate">{bookTitle}</p>
              <p className="text-Gray-4 subhead_4_1 truncate">{bookAuthor}</p>
            </div>
          </div>

          {/* 좋아요/공유 + 시간/조회수 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Image src="/gray_heart.svg" alt="heart" width={24} height={24} />
              <span className="subhead_4_1 text-Gray-5">
                좋아요 {likeCount}
              </span>
              <Image
                src="/share.svg"
                alt="share"
                width={24}
                height={24}
                className="ml-2"
              />
              <span className="subhead_4_1 text-Gray-5">공유하기</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="body_1_2 text-Gray-3">{timeAgo(createdAt)}</span>
              <span className="body_1_2 text-Gray-3">조회수 {viewCount}</span>
            </div>
          </div>
        </div>

        {/* 구독 + 햄버거 */}
        <div className="flex flex-col items-end gap-3 shrink-0 t:mr-[20px] d:mr-[130px]">
          <button
            type="button"
            onClick={onSubscribeClick}
            className="flex px-[17px] py-[8px]  justify-center items-center rounded-lg bg-primary-2 text-White body_2_1 shrink-0 whitespace-nowrap cursor-pointer"
          >
            {subscribeText}
          </button>

          {/* 햄버거 */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer "
            >
              <Image src="/menu_dots.svg" alt="메뉴" width={24} height={24} />
            </button>

            {/* 드롭다운 메뉴 */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-34 h-22 rounded-lg bg-White z-10 px-2 shadow-md">
                <button
                  type="button"
                  onClick={() => {
                    console.log("신고하기");
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
                >
                  <Image src="/report.svg" alt="신고" width={20} height={20} />
                  신고하기
                </button>
                <div className="mx-2 border-b border-Subbrown-4" />
                <button
                  type="button"
                  onClick={() => {
                    console.log("공유하기");
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
                >
                  <Image
                    src="/gray_share.svg"
                    alt="공유"
                    width={20}
                    height={20}
                  />
                  공유하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
