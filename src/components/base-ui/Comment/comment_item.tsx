"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CommentHeader from "./comment_header";
import CommentMenu from "./comment_menu";
import CommentEditForm from "./comment_edit_form";

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
  onProfileClick?: (nickname: string) => void;
};

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
  onProfileClick,
}: CommentItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== content) {
      onEdit?.(id, editContent);
    }
    setIsEditing(false);
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
          <p className="Body_1_2 text-Gray-5 flex-1 whitespace-pre-wrap">
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
          onCancel={() => {
            setEditContent(content);
            setIsEditing(false);
          }}
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