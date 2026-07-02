"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CommentHeader from "./comment_header";
import CommentMenu from "./comment_menu";
import CommentEditForm from "./comment_edit_form";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

type CommentItemProps = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean; // 작성자 뱃지용
  isMine?: boolean;
  isBlocked?: boolean; // 차단된 사용자의 댓글
  isReply?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canReport?: boolean;
  onReply?: (id: number) => void;
  onEdit?: (id: number, content: string) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
  onReport?: (id: number) => void;
  onProfileClick?: (nickname: string) => void;
};

export default function CommentItem({
  id,
  authorName,
  profileImgSrc = DEFAULT_PROFILE_IMAGE,
  content,
  createdAt,
  isAuthor = false,
  isMine = false,
  isBlocked = false,
  isReply = false,
  canEdit = false,
  canDelete = false,
  canReport = false,
  onReply,
  onEdit,
  onDelete,
  onReport,
  onProfileClick,
}: CommentItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const isEditDirty = isEditing && editContent !== content;
  const { confirmNavigation } = useUnsavedChangesGuard({
    isDirty: isEditDirty,
    variant: "edit",
    title: "수정 중인 댓글이 있어요",
    description: "이 화면을 나가면 수정한 댓글이 저장되지 않습니다.",
  });

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== content) {
      onEdit?.(id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (!isEditDirty) {
      setEditContent(content);
      setIsEditing(false);
      return;
    }

    confirmNavigation(
      () => {
        setEditContent(content);
        setIsEditing(false);
      },
      {
        title: "수정 중인 댓글이 있어요",
        description: "댓글 수정을 취소하면 입력한 내용이 사라집니다.",
        leaveText: "취소하기",
        stayText: "계속 수정",
      }
    );
  };

  const derivedCanEdit = canEdit || isMine;
  const derivedCanDelete = canDelete || isMine;
  const derivedCanReport = canReport || !isMine;

  const hasReplyAction = !isReply && !!onReply;
  const hasMenuAction =
    hasReplyAction || derivedCanDelete || derivedCanEdit || derivedCanReport;

  const body = (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <CommentHeader
        authorName={authorName}
        profileImgSrc={profileImgSrc}
        isAuthor={isAuthor}
        createdAt={createdAt}
        onProfileClick={onProfileClick}
      />

      {!isEditing ? (
        <div className="flex items-start justify-between gap-2">
          <p className={`body_1_2 flex-1 whitespace-pre-wrap ${isBlocked ? "text-Gray-3 italic" : "text-Gray-5"}`}>
            {content}
          </p>
          {hasMenuAction && (
            <CommentMenu
              open={menuOpen}
              onToggle={() => setMenuOpen((v) => !v)}
              onClose={() => setMenuOpen(false)}
              hasReplyAction={hasReplyAction}
              canEdit={derivedCanEdit}
              canDelete={derivedCanDelete}
              canReport={derivedCanReport}
              onReply={() => onReply?.(id)}
              onEdit={() => setIsEditing(true)}
              onDelete={() => onDelete?.(id)}
              onReport={() => onReport?.(id)}
            />
          )}
        </div>
      ) : (
        <CommentEditForm
          value={editContent}
          onChange={setEditContent}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );

  // 대댓글이면 reply 아이콘 + 댓글 본체
  if (isReply) {
    return (
      <div className="flex items-start gap-4 t:gap-8 py-4">
        <Image
          src="/reply.svg"
          alt="대댓글"
          width={40}
          height={40}
          className="shrink-0 w-6 h-6 t:w-10 t:h-10 mt-1"
        />
        {body}
      </div>
    );
  }

  // 일반 댓글
  return <div className="py-4 flex">{body}</div>;
}
