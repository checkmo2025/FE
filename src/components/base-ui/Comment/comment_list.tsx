"use client";

import { useState } from "react";
import CommentInput from "./comment_input";
import CommentItem from "./comment_item";
import Image from "next/image";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import { clampTextToLimit, isTextOverLimit } from "@/utils/inputLimit";

// 댓글 목록 (댓글 입력창 + 댓글 + 대댓글) 컴포넌트
export type Comment = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean; // 글 작성자인지 (뱃지용)
  isMine?: boolean; // 내가 쓴 댓글인지
  isBlocked?: boolean; // 차단된 사용자의 댓글인지 (서버에서 "차단된 사용자입니다"로 마스킹)
  parentCommentId?: number | null;
  replies?: Comment[];
};

type CommentListProps = {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply?: (parentId: number, content: string) => void;
  onEditComment?: (id: number, content: string) => void;
  onDeleteComment?: (id: number) => void;
  onReportComment?: (id: number) => void;
  onProfileClick?: (nickname: string) => void;
};

export default function CommentList({
  comments,
  onAddComment,
  onAddReply,
  onEditComment,
  onDeleteComment,
  onReportComment,
  onProfileClick,
}: CommentListProps) {
  // 각 댓글의 답글 입력창 표시 여부
  const [replyInputOpen, setReplyInputOpen] = useState<Record<number, boolean>>({});
  // 각 댓글의 답글 입력 내용을 관리
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});
  const hasReplyDraft = Object.values(replyContents).some((content) => content.trim());
  const { confirmNavigation } = useUnsavedChangesGuard({
    isDirty: hasReplyDraft,
    variant: "create",
    title: "작성 중인 답글이 있어요",
    description: "이 화면을 나가면 입력한 답글이 저장되지 않습니다.",
  });

  const handleReplyClick = (commentId: number) => {
    if (replyInputOpen[commentId] && replyContents[commentId]?.trim()) {
      confirmNavigation(
        () => {
          setReplyInputOpen((prev) => ({
            ...prev,
            [commentId]: false,
          }));
          setReplyContents((prev) => {
            const next = { ...prev };
            delete next[commentId];
            return next;
          });
        },
        {
          title: "작성 중인 답글이 있어요",
          description: "답글 작성을 취소하면 입력한 내용이 사라집니다.",
          leaveText: "취소하기",
          stayText: "계속 작성",
        }
      );
      return;
    }

    setReplyInputOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    if (!replyInputOpen[commentId]) {
      setReplyContents((prev) => ({
        ...prev,
        [commentId]: "",
      }));
    }
  };

  const handleReplySubmit = (commentId: number) => {
    const replyContent = replyContents[commentId]?.trim();
    if (!replyContent) return;
    if (
      isTextOverLimit(
        replyContent,
        INPUT_LIMITS.BOOK_STORY_COMMENT,
        `댓글은 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자 이하여야 합니다.`
      )
    ) {
      return;
    }

    // 답글 추가
    if (onAddReply) {
      onAddReply(commentId, replyContent);
    }

    // 답글 입력창 닫기 및 내용 초기화
    setReplyInputOpen((prev) => ({
      ...prev,
      [commentId]: false,
    }));
    setReplyContents((prev) => {
      const newContents = { ...prev };
      delete newContents[commentId];
      return newContents;
    });
  };

  const handleReplyContentChange = (commentId: number, content: string) => {
    setReplyContents((prev) => ({
      ...prev,
      [commentId]: clampTextToLimit(
        content,
        INPUT_LIMITS.BOOK_STORY_COMMENT,
        `댓글은 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자 이하여야 합니다.`
      ),
    }));
  };

  return (
    <div className="w-full">
      {/* 댓글 헤더 */}
      <h3 className="subhead_4_1 t:subhead_1 text-Gray-7 mb-4">댓글</h3>

      {/* 댓글 입력 */}
      <CommentInput onSubmit={onAddComment} />

      {/* 댓글 목록 */}
      <div className="mt-6 divide-y divide-Subbrown-4">
        {comments.map((comment) => {
          const isReplyInputVisible = replyInputOpen[comment.id];
          const replyContent = replyContents[comment.id] || "";

          return (
            <div key={comment.id}>
              <CommentItem
                id={comment.id}
                authorName={comment.authorName}
                profileImgSrc={comment.profileImgSrc}
                content={comment.content}
                createdAt={comment.createdAt}
                isAuthor={comment.isAuthor}
                isMine={comment.isMine}
                isBlocked={comment.isBlocked}
                onReply={comment.isBlocked ? undefined : handleReplyClick}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                onReport={comment.isBlocked ? undefined : onReportComment}
                onProfileClick={comment.isBlocked ? undefined : onProfileClick}
              />

              {/* 답글 입력창  */}
              {isReplyInputVisible && (
                <div className="flex flex-col gap-2 py-2 w-full">
                  <div className="flex items-center gap-2 pl-[40px] t:pl-[72px]">
                    <span className="text-primary-3 body_2_1 t:body_1_2 bg-Subbrown-4 px-3 py-1 rounded-full shrink-0">
                      @{comment.authorName} 님에게 답글
                    </span>
                  </div>
                  <div className="flex items-center gap-4 t:gap-8">
                    <Image
                      src="/reply.svg"
                      alt="대댓글"
                      width={40}
                      height={40}
                      className="shrink-0 w-6 h-6 t:w-10 t:h-10 self-start mt-2"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) =>
                          handleReplyContentChange(comment.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleReplySubmit(comment.parentCommentId || comment.id);
                          }
                        }}
                        placeholder={`답글 내용을 입력해주세요 (최대 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자)`}
                        className="flex-1 min-w-0 h-[36px] t:h-[56px] px-4 py-3 rounded-lg border border-Subbrown-4 bg-White body_1_2 text-Gray-7 placeholder:text-Gray-3 outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleReplySubmit(comment.parentCommentId || comment.id)}
                        className="px-4 t:px-6 py-2 t:py-3 h-[36px] t:h-[56px] border border-Subbrown-3 text-primary-3 rounded-lg bg-Subbrown-4 subhead_4_1 cursor-pointer shrink-0"
                      >
                        입력
                      </button>
                    </div>
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
                    createdAt={reply.createdAt}
                    isAuthor={reply.isAuthor}
                    isMine={reply.isMine}
                    isBlocked={reply.isBlocked}
                    isReply
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                    onReport={reply.isBlocked ? undefined : onReportComment}
                    onProfileClick={reply.isBlocked ? undefined : onProfileClick}
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
