"use client";

import { useState } from "react";
import CommentInput from "./comment_input";
import CommentItem from "./comment_item";
import Image from "next/image";

// 댓글 목록 (댓글 입력창 + 댓글 + 대댓글) 컴포넌트
export type Comment = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean; // 글 작성자인지 (뱃지용)
  isMine?: boolean; // 내가 쓴 댓글인지
  replies?: Comment[];
};

type CommentListProps = {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply?: (parentId: number, content: string) => void;
  onEditComment?: (id: number, content: string) => void;
  onDeleteComment?: (id: number) => void;
  onReportComment?: (id: number) => void;
};

export default function CommentList({
  comments,
  onAddComment,
  onAddReply,
  onEditComment,
  onDeleteComment,
  onReportComment,
}: CommentListProps) {
  // 각 댓글의 답글 입력창 표시 여부
  const [replyInputOpen, setReplyInputOpen] = useState<Record<number, boolean>>({});
  // 각 댓글의 답글 입력 내용을 관리
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});

  const handleReplyClick = (commentId: number) => {
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
      [commentId]: content,
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
                onReply={handleReplyClick}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                onReport={onReportComment}
              />

              {/* 답글 입력창  */}
              {isReplyInputVisible && (
                <div className="flex items-center gap-4 t:gap-8 py-2">
                  <Image
                    src="/reply.svg"
                    alt="대댓글"
                    width={40}
                    height={40}
                    className="shrink-0 w-6 h-6 t:w-10 t:h-10 self-start mt-4"
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
                          handleReplySubmit(comment.id);
                        }
                      }}
                      placeholder="답글 달기"
                      className="flex-1 w-[240px] h-[36px] t:w-[850px] t:h-[56px] px-4 py-3 rounded-lg border border-Subbrown-4 bg-White Body_1_2 text-Gray-7 placeholder:text-Gray-3 outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleReplySubmit(comment.id)}
                      className="px-auto t:px-6 py-auto t:py-3 w-[60px] h-[36px] t:w-[128px] t:h-[56px] border border-Subbrown-3 text-primary-3 rounded-lg bg-Subbrown-4 subhead_4_1 cursor-pointer"
                    >
                      입력
                    </button>
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
                    isReply
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                    onReport={onReportComment}
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
