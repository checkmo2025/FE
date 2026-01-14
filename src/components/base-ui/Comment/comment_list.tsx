"use client";

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
  return (
    <div className="w-full">
      {/* 댓글 헤더 */}
      <h3 className="subhead_4_1 t:subhead_1 text-Gray-7 mb-4">댓글</h3>

      {/* 댓글 입력 */}
      <CommentInput onSubmit={onAddComment} />

      {/* 댓글 목록 */}
      <div className="mt-6 divide-y divide-Subbrown-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              id={comment.id}
              authorName={comment.authorName}
              profileImgSrc={comment.profileImgSrc}
              content={comment.content}
              createdAt={comment.createdAt}
              isAuthor={comment.isAuthor}
              isMine={comment.isMine}
              onReply={
                onAddReply ? () => onAddReply(comment.id, "") : undefined
              }
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onReport={onReportComment}
            />
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
        ))}
      </div>
    </div>
  );
}
