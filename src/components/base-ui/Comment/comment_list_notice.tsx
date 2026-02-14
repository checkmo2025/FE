"use client";

import CommentInput from "./comment_input";
import CommentItem from "./comment_item";

// 댓글 목록 (댓글 입력창 + 댓글) 컴포넌트
export type Comment = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean; // 글 작성자
  isMine?: boolean; // 내가 쓴 댓글인지
};

type CommentListNoticeProps = {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onEditComment?: (id: number, content: string) => void;
  onDeleteComment?: (id: number) => void;
  onReportComment?: (id: number) => void;
  isAdminView?: boolean;
};

export default function CommentListNotice({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  isAdminView = false,
}: CommentListNoticeProps) {
  return (
    <div className="w-full">
      <h3 className="subhead_4_1 t:subhead_1 text-Gray-7 mb-4">댓글</h3>
      <CommentInput onSubmit={onAddComment} />

      {/* 댓글 목록 */}
      <div className="mt-6 divide-y divide-Subbrown-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            authorName={comment.authorName}
            profileImgSrc={comment.profileImgSrc}
            content={comment.content}
            createdAt={comment.createdAt}
            isAuthor={comment.isAuthor}
            isMine={comment.isMine}
            isAdminView={isAdminView}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onReport={onReportComment}
          />
        ))}
      </div>
    </div>
  );
}
