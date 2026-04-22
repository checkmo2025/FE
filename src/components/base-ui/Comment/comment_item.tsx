"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// 댓글 1개 컴포넌트
type CommentItemProps = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean; // 작성자 뱃지용
  isMine?: boolean;
  isReply?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canReport?: boolean;
  onReply?: (id: number) => void;
  onEdit?: (id: number, content: string) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
  onReport?: (id: number) => void;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export default function CommentItem({
  id,
  authorName,
  profileImgSrc = "/profile2.svg",
  content,
  createdAt,
  isAuthor = false,
  isMine = false,
  isReply = false,
  canEdit = false,
  canDelete = false,
  canReport = false,
  onReply,
  onEdit,
  onDelete,
  onReport,
}: CommentItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

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

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== content) {
      onEdit?.(id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const derivedCanEdit = canEdit || isMine;
  const derivedCanDelete = canDelete || isMine;
  const derivedCanReport = canReport || (!isMine);

  const hasReplyAction = !isReply && !!onReply;
  const hasManageAction = derivedCanDelete || derivedCanEdit;
  const hasMenuAction = hasReplyAction || hasManageAction || derivedCanReport;

  // 댓글 본체 (프로필 + 이름 + 작성자 + 날짜 + 내용 + 메뉴)
  const commentBody = (
    <div className="flex flex-col gap-2 flex-1">
      {/* 상단: 프로필 + 이름 + 작성자 + 날짜 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 프로필 이미지 */}
          <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden">
            <Image
              src={profileImgSrc}
              alt={authorName}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <span className="Subhead_4_1 text-Gray-7">{authorName}</span>
          {isAuthor && (
            <span className="px-2 py-0.5 Subhead_4 text-Gray-3">작성자</span>
          )}
        </div>
        <span className="Body_1_2 text-Gray-3">{formatDate(createdAt)}</span>
      </div>

      {/* 댓글 내용 + 메뉴 (같은 줄) */}
      {!isEditing ? (
        <div className="flex items-start justify-between gap-2">
          <p className="Body_1_2 text-Gray-5 flex-1 whitespace-pre-wrap">{content}</p>

          {hasMenuAction && (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 cursor-pointer"
              >
                <Image src="/menu_dots.svg" alt="메뉴" width={20} height={20} />
              </button>

              {/* 드롭다운 메뉴 */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-[137px] rounded-lg bg-White shadow-lg z-10 overflow-hidden">

                  {/* 답글달기 - 상위 댓글일 때만 표시 */}
                  {hasReplyAction && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onReply?.(id);
                          setMenuOpen(false);
                        }}
                        className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
                      >
                        <Image src="/reply2.svg" alt="답글" width={24} height={24} />
                        답글달기
                      </button>
                      {(hasManageAction || derivedCanReport) && (
                        <div className="mx-2 border-b border-Subbrown-4" />
                      )}
                    </>
                  )}

                  {/* 내 댓글일 경우 삭제/수정, 아닐 경우 신고 */}
                  {hasManageAction ? (
                    <>
                      {derivedCanDelete && (
                        <button
                          type="button"
                          onClick={() => {
                            onDelete?.(id);
                            setMenuOpen(false);
                          }}
                          className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
                        >
                          <Image
                            src="/delete.svg"
                            alt="삭제"
                            width={24}
                            height={24}
                          />
                          삭제하기
                        </button>
                      )}

                      {derivedCanEdit && derivedCanDelete && (
                        <div className="mx-2 border-b border-Subbrown-4" />
                      )}

                      {derivedCanEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(true);
                            setMenuOpen(false);
                          }}
                          className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
                        >
                          <Image
                            src="/edit2.svg"
                            alt="수정"
                            width={24}
                            height={24}
                          />
                          수정하기
                        </button>
                      )}
                    </>
                  ) : (
                    derivedCanReport && (
                      <button
                        type="button"
                        onClick={() => {
                          onReport?.(id);
                          setMenuOpen(false);
                        }}
                        className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
                      >
                        <Image
                          src="/report.svg"
                          alt="신고"
                          width={24}
                          height={24}
                        />
                        신고하기
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 수정 모드 */
        <div className="flex flex-col gap-2 mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[80px] px-4 py-3 rounded-lg border border-Subbrown-4 bg-White Body_1_2 text-Gray-7 outline-none focus:border-primary-3 resize-none whitespace-pre-wrap"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg bg-Gray-2 text-Gray-6 subhead_4_1"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-lg bg-primary-3 text-White subhead_4_1"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // 대댓글이면 reply 아이콘 + 댓글 본체
  if (isReply) {
    return (
      <div className="flex items-center gap-4 t:gap-8 py-4">
        <Image
          src="/reply.svg"
          alt="대댓글"
          width={40}
          height={40}
          className="shrink-0 w-6 h-6 t:w-10 t:h-10 self-start mt-1"
        />
        {commentBody}
      </div>
    );
  }

  // 일반 댓글
  return <div className="py-4">{commentBody}</div>;
}