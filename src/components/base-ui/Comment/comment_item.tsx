"use client";

import { useState } from "react";
import Image from "next/image";
import CommentHeader from "./comment_header";
import CommentMenu from "./comment_menu";
import CommentEditForm from "./comment_edit_form";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import type { ImageUploadType } from "@/lib/api/endpoints/Image";
import { useImageAttachments } from "@/hooks/useImageAttachments";
import ImageGallery from "@/components/common/ImageGallery";
import toast from "react-hot-toast";

type CommentItemProps = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  imageUrls?: string[];
  createdAt: string;
  isAuthor?: boolean; // 작성자 뱃지용
  isMine?: boolean;
  isBlocked?: boolean; // 차단된 사용자의 댓글
  isDeleted?: boolean;
  isReply?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canReport?: boolean;
  onReply?: (id: number) => void;
  onEdit?: (id: number, content: string, imageUrls: string[]) => void | boolean | Promise<void | boolean>;
  onDelete?: (id: number) => void | Promise<void>;
  onReport?: (id: number) => void;
  onProfileClick?: (nickname: string) => void;
  imageUploadType?: ImageUploadType;
};

export default function CommentItem({
  id,
  authorName,
  profileImgSrc = DEFAULT_PROFILE_IMAGE,
  content,
  imageUrls = [],
  createdAt,
  isAuthor = false,
  isMine = false,
  isBlocked = false,
  isDeleted = false,
  isReply = false,
  canEdit = false,
  canDelete = false,
  canReport = false,
  onReply,
  onEdit,
  onDelete,
  onReport,
  onProfileClick,
  imageUploadType,
}: CommentItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const editAttachments = useImageAttachments(imageUrls);
  const { reset: resetEditAttachments, resolveUrls: resolveEditImageUrls } = editAttachments;
  const isEditDirty = isEditing && (editContent !== content || editAttachments.isDirty);
  const { confirmNavigation } = useUnsavedChangesGuard({
    isDirty: isEditDirty,
    variant: "edit",
    title: "수정 중인 댓글이 있어요",
    description: "이 화면을 나가면 수정한 댓글이 저장되지 않습니다.",
  });

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    try {
      const resolvedImageUrls = imageUploadType
        ? await resolveEditImageUrls(imageUploadType)
        : imageUrls;
      const result = await onEdit?.(id, editContent, resolvedImageUrls);
      if (result !== false) setIsEditing(false);
    } catch {
      toast.error("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleCancelEdit = () => {
    if (!isEditDirty) {
      setEditContent(content);
      resetEditAttachments(imageUrls);
      setIsEditing(false);
      return;
    }

    confirmNavigation(
      () => {
        setEditContent(content);
        resetEditAttachments(imageUrls);
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

  const derivedCanEdit = !isDeleted && (canEdit || isMine);
  const derivedCanDelete = !isDeleted && (canDelete || isMine);
  const derivedCanReport = !isDeleted && (canReport || !isMine);

  const hasReplyAction = !isDeleted && !isReply && !!onReply;
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
        <div className="flex flex-col gap-3">
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
                onEdit={() => {
                  setEditContent(content);
                  resetEditAttachments(imageUrls);
                  setIsEditing(true);
                }}
                onDelete={() => onDelete?.(id)}
                onReport={() => onReport?.(id)}
              />
            )}
          </div>
          {!isBlocked && <ImageGallery imageUrls={imageUrls} compact />}
        </div>
      ) : (
        <CommentEditForm
          value={editContent}
          onChange={setEditContent}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          attachmentController={imageUploadType ? editAttachments : undefined}
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
