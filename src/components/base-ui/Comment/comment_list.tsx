"use client";

import { useState } from "react";
import CommentInput from "./comment_input";
import CommentItem from "./comment_item";
import type { ImageUploadType } from "@/lib/api/endpoints/Image";

// 댓글 목록 (댓글 입력창 + 댓글 + 대댓글) 컴포넌트
export type Comment = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
  isAuthor?: boolean; // 글 작성자인지 (뱃지용)
  isMine?: boolean; // 내가 쓴 댓글인지
  isBlocked?: boolean; // 차단된 사용자의 댓글인지 (서버에서 "차단된 사용자입니다"로 마스킹)
  isDeleted?: boolean; // 삭제된 댓글인지
  parentCommentId?: number | null;
  replies?: Comment[];
};

type CommentListProps = {
  comments: Comment[];
  onAddComment: (content: string, imageUrls: string[]) => void | boolean | Promise<void | boolean>;
  onAddReply?: (parentId: number, content: string, imageUrls: string[]) => void | boolean | Promise<void | boolean>;
  onEditComment?: (id: number, content: string, imageUrls: string[]) => void | boolean | Promise<void | boolean>;
  onDeleteComment?: (id: number) => void;
  onReportComment?: (id: number) => void;
  onProfileClick?: (nickname: string) => void;
  imageUploadType?: ImageUploadType;
  beforeSubmit?: () => boolean;
};

export default function CommentList({
  comments,
  onAddComment,
  onAddReply,
  onEditComment,
  onDeleteComment,
  onReportComment,
  onProfileClick,
  imageUploadType,
  beforeSubmit,
}: CommentListProps) {
  // 각 댓글의 답글 입력창 표시 여부
  const [replyInputOpen, setReplyInputOpen] = useState<Record<number, boolean>>({});
  const handleReplyClick = (commentId: number) => {
    setReplyInputOpen((prev) => ({
      ...prev,
      [commentId]: true,
    }));
  };

  return (
    <div className="w-full">
      {/* 댓글 헤더 */}
      <h3 className="subhead_4_1 t:subhead_1 text-Gray-7 mb-4">댓글</h3>

      {/* 댓글 입력 */}
      <CommentInput
        onSubmit={onAddComment}
        imageUploadType={imageUploadType}
        beforeSubmit={beforeSubmit}
      />

      {/* 댓글 목록 */}
      <div className="mt-6 divide-y divide-Subbrown-4">
        {comments.map((comment) => {
          const isReplyInputVisible = replyInputOpen[comment.id];
          return (
            <div key={comment.id}>
              <CommentItem
                id={comment.id}
                authorName={comment.authorName}
                profileImgSrc={comment.profileImgSrc}
                content={comment.content}
                imageUrls={comment.imageUrls}
                createdAt={comment.createdAt}
                isAuthor={comment.isAuthor}
                isMine={comment.isMine}
                isBlocked={comment.isBlocked}
                isDeleted={comment.isDeleted}
                onReply={comment.isBlocked || comment.isDeleted ? undefined : handleReplyClick}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                onReport={comment.isBlocked || comment.isDeleted ? undefined : onReportComment}
                onProfileClick={comment.isBlocked || comment.isDeleted ? undefined : onProfileClick}
                imageUploadType={imageUploadType}
              />

              {/* 답글 입력창  */}
              {isReplyInputVisible && (
                <div className="flex flex-col gap-2 py-2 w-full">
                  <div className="flex items-center gap-2 pl-[40px] t:pl-[72px]">
                    <span className="text-primary-3 body_2_1 t:body_1_2 bg-Subbrown-4 px-3 py-1 rounded-full shrink-0">
                      @{comment.authorName} 님에게 답글
                    </span>
                  </div>
                  <div className="pl-[40px] t:pl-[72px]">
                    <CommentInput
                      imageUploadType={imageUploadType}
                      beforeSubmit={beforeSubmit}
                      placeholder="답글 내용을 입력해주세요"
                      onSubmit={async (content, imageUrls) => {
                        const result = await onAddReply?.(
                          comment.parentCommentId || comment.id,
                          content,
                          imageUrls
                        );
                        if (result !== false) {
                          setReplyInputOpen((prev) => ({ ...prev, [comment.id]: false }));
                        }
                        return result;
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 대댓글 */}
              {comment.replies?.map((reply) => (
                <div key={reply.id} className="border-t border-Subbrown-4">
                  <CommentItem
                    id={reply.id}
                    authorName={reply.authorName}
                    profileImgSrc={reply.profileImgSrc}
                    content={reply.content}
                    imageUrls={reply.imageUrls}
                    createdAt={reply.createdAt}
                    isAuthor={reply.isAuthor}
                    isMine={reply.isMine}
                    isBlocked={reply.isBlocked}
                    isDeleted={reply.isDeleted}
                    isReply
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                    onReport={reply.isBlocked || reply.isDeleted ? undefined : onReportComment}
                    onProfileClick={reply.isBlocked || reply.isDeleted ? undefined : onProfileClick}
                    imageUploadType={imageUploadType}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
