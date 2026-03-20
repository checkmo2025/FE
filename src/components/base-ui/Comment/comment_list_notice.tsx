"use client";

import { useEffect, useRef } from "react";
import CommentInput from "./comment_input";
import CommentItem from "./comment_item";

// 댓글 목록 (댓글 입력창 + 댓글) 컴포넌트
export type Comment = {
  id: number;
  authorName: string;
  profileImgSrc?: string;
  content: string;
  createdAt: string;

  isAuthor?: boolean;
  isMine?: boolean;

  canEdit?: boolean;
  canDelete?: boolean;
  canReport?: boolean;
};

type CommentListNoticeProps = {
  comments: Comment[];
  onAddComment: (content: string) => void | Promise<void>;
  onEditComment?: (id: number, content: string) => void | Promise<void>;
  onDeleteComment?: (id: number) => void | Promise<void>;
  onReportComment?: (id: number) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

export default function CommentListNotice({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  onLoadMore,
  hasNextPage = false,
  isFetchingNextPage = false,
}: CommentListNoticeProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !onLoadMore || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);

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
            canEdit={comment.canEdit}
            canDelete={comment.canDelete}
            canReport={comment.canReport}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onReport={onReportComment}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-2" />
    </div>
  );
}