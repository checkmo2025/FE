"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ReportModal from "@/components/common/modals/report-block/ReportModal";
import { useReportMemberMutation } from "@/hooks/mutations/useMemberMutations";
import { ReportReason } from "@/types/report";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

type BookstoryDetailProps = {
  imageUrl?: string;

  authorName: string;
  authorNickname: string;
  authorId: string | number;

  profileImgSrc?: string; // 기본: DEFAULT_PROFILE_IMAGE
  subscribeText?: string; // 기본: "구독"
  isFollowing?: boolean;
  onSubscribeClick?: () => void;

  bookTitle: string;
  bookAuthor: string;
  bookDetail?: string;

  createdAt: string;
  viewCount: number;
  likeCount?: number;

  authorHref?: string; // 기본: `/profile/${authorId}`
  className?: string;
  id?: number;
  likedByMe?: boolean;
  onLikeClick?: (e: React.MouseEvent) => void;
  hideSubscribeButton?: boolean;
  isMyStory?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
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
  profileImgSrc = DEFAULT_PROFILE_IMAGE,
  subscribeText = "구독",
  isFollowing = false,
  onSubscribeClick,
  bookTitle,
  bookAuthor,
  createdAt,
  viewCount,
  likeCount = 1,
  authorHref,
  className = "",
  id,
  likedByMe = false,
  onLikeClick,
  hideSubscribeButton = false,
  isMyStory = false,
  onEditClick,
  onDeleteClick,
}: BookstoryDetailProps) {
  const href = authorHref ?? (isMyStory ? "/profile/mypage" : `/profile/${encodeURIComponent(authorId)}`);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const tabletMenuRef = useRef<HTMLDivElement>(null);
  const heartIcon = likedByMe ? "/red_heart.svg" : "/gray_heart.svg";
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const { mutate: reportMember } = useReportMemberMutation();

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideMobileMenu = mobileMenuRef.current?.contains(target) ?? false;
      const isInsideTabletMenu = tabletMenuRef.current?.contains(target) ?? false;

      if (!isInsideMobileMenu && !isInsideTabletMenu) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReportSubmit = (reason: ReportReason, content: string) => {
    if (id == null) return;
    reportMember({
      targetType: "BOOK_STORY",
      targetId: String(id),
      reason,
      content,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("클립보드에 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
    setMenuOpen(false);
  };

  const renderDropdownMenu = () => {
    if (!menuOpen) return null;

    const menuItems = isMyStory
      ? [
          { label: "수정하기", icon: "/Edit.svg", onClick: onEditClick },
          { label: "삭제하기", icon: "/delete.svg", onClick: onDeleteClick },
          { label: "공유하기", icon: "/gray_share.svg", onClick: handleShare },
        ]
      : [
          {
            label: "신고하기",
            icon: "/report.svg",
            onClick: () => {
              if (!isLoggedIn) {
                openLoginModal();
                return;
              }
              setIsReportModalOpen(true);
            },
          },
          { label: "공유하기", icon: "/gray_share.svg", onClick: handleShare },
        ];

    return (
      <div className="absolute right-0 top-full mt-1 w-34 h-auto py-1 rounded-lg bg-White z-10 px-2 shadow-md flex flex-col justify-center">
        {menuItems.map((item, index) => (
          <div key={item.label}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                item.onClick?.();
              }}
              className="flex w-full items-center gap-2 px-4 py-3 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              {item.label}
            </button>
            {index < menuItems.length - 1 && (
              <div className="mx-2 border-b border-Subbrown-4" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`flex min-w-0 flex-col t:flex-row w-full px-[20px] items-start gap-4 t:gap-[28px] bg-Background ${className}`}
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
        {!hideSubscribeButton && (
          <button
            type="button"
            onClick={onSubscribeClick}
            className={`flex px-4 py-1.5 justify-center items-center rounded-lg text-White text-[12px] font-medium shrink-0 cursor-pointer transition-colors ${isFollowing
              ? "bg-Subbrown-4 text-primary-3 hover:bg-Subbrown-3"
              : "bg-primary-2 text-White hover:bg-primary-1"
              }`}
          >
            {subscribeText}
          </button>
        )}
      </div>

      {/* 모바일: 책 제목 + 햄버거 */}
      <div className="flex t:hidden items-start justify-between w-full">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="text-Gray-7 subhead_3_1 truncate">{bookTitle}</p>
          <p className="text-Gray-4 body_1_2 truncate">{bookAuthor}</p>
        </div>

        {/* 햄버거 */}
        <div className="relative shrink-0 ml-2" ref={mobileMenuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            <Image src="/menu_dots.svg" alt="메뉴" width={24} height={24} />
          </button>

          {renderDropdownMenu()}
        </div>
      </div>

      {/* 모바일: 이미지 + 좋아요/공유 */}
      <div className="flex t:hidden justify-between gap-4 w-full">
        {/* 이미지 */}
        <div className="relative w-[106px] h-[130px] shrink-0">
          <Image src={imageUrl} alt={bookTitle} fill className="object-cover" />
        </div>

        {/* 좋아요/공유 */}
        <div className="flex w-[132px] shrink-0 flex-col items-start gap-5 pt-1">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick?.(e);
            }}
            className="flex h-8 w-full items-center gap-2 rounded-full p-1 text-left transition-colors hover:bg-gray-100 cursor-pointer"
          >
            <Image src={heartIcon} alt="heart" width={20} height={20} />
            <span className={`body_1_2 ${likedByMe ? 'text-primary-2' : 'text-Gray-5'}`}>좋아요 {likeCount}</span>
          </div>
          <div
            className="flex h-8 w-full items-center gap-2 rounded-full p-1 text-left transition-colors hover:bg-gray-100 cursor-pointer"
            onClick={handleShare}
          >
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
        <div className="flex min-w-0 flex-col justify-between h-full">
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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onLikeClick?.(e);
                }}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded-full transition-colors group"
              >
                <Image src={heartIcon} alt="heart" width={24} height={24} />
                <span className={`subhead_4_1 ${likedByMe ? 'text-primary-2' : 'text-Gray-5'}`}>
                  좋아요 {likeCount}
                </span>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded-full transition-colors group"
                onClick={handleShare}
              >
                <Image
                  src="/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                />
                <span className="subhead_4_1 text-Gray-5">공유하기</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="body_1_2 text-Gray-3">{timeAgo(createdAt)}</span>
              <span className="body_1_2 text-Gray-3">조회수 {viewCount}</span>
            </div>
          </div>
        </div>

        {/* 구독 + 햄버거 */}
        <div className="flex flex-col items-end gap-3 shrink-0 t:mr-[20px] d:mr-[130px]">
          {!hideSubscribeButton && (
            <button
              type="button"
              onClick={onSubscribeClick}
              className={`flex px-[17px] py-[8px] justify-center items-center rounded-lg body_2_1 shrink-0 whitespace-nowrap cursor-pointer transition-colors ${isFollowing
                ? "bg-Subbrown-4 text-primary-3 hover:bg-Subbrown-3"
                : "bg-primary-2 text-White hover:bg-primary-1"
                }`}
            >
              {subscribeText}
            </button>
          )}

          {/* 햄버거 */}
          <div className="relative" ref={tabletMenuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer "
            >
              <Image src="/menu_dots.svg" alt="메뉴" width={24} height={24} />
            </button>

            {/* 드롭다운 메뉴 */}
            {renderDropdownMenu()}
          </div>
        </div>
      </div>
      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        defaultReason="GENERAL"
      />
    </div>
  );
}
