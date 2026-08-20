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
  imageUrls: string[];
  createdAt: string;

  isAuthor?: boolean;
  isMine?: boolean;

  canEdit?: boolean;
  canDelete?: boolean;
  canReport?: boolean;
};

type CommentListNoticeProps = {
  comments: Comment[];
  onAddComment: (content: string, imageUrls: string[]) => void | boolean | Promise<void | boolean>;
  onEditComment?: (id: number, content: string, imageUrls: string[]) => void | boolean | Promise<void | boolean>;
  onDeleteComment?: (id: number) => void | Promise<void>;
  onReportComment?: (id: number) => void;
  onProfileClick?: (nickname: string) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  beforeSubmit?: () => boolean;
};

export default function CommentListNotice({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  onProfileClick,
  onLoadMore,
  hasNextPage = false,
  isFetchingNextPage = false,
  beforeSubmit,
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
      <CommentInput
        onSubmit={onAddComment}
        imageUploadType="NOTICE_COMMENT"
        beforeSubmit={beforeSubmit}
      />

      {/* 댓글 목록 */}
      <div className="mt-6 divide-y divide-Subbrown-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            authorName={comment.authorName}
            profileImgSrc={comment.profileImgSrc}
            content={comment.content}
            imageUrls={comment.imageUrls}
            createdAt={comment.createdAt}
            isAuthor={comment.isAuthor}
            isMine={comment.isMine}
            canEdit={comment.canEdit}
            canDelete={comment.canDelete}
            canReport={comment.canReport}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onReport={onReportComment}
            onProfileClick={onProfileClick}
            imageUploadType="NOTICE_COMMENT"
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-2" />
    </div>
  );
}
