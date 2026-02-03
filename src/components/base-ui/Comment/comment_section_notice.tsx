"use client";

import { useState } from "react";
import CommentListNotice, { Comment } from "./comment_list_notice";

// 더미 댓글 데이터
const DUMMY_COMMENTS: Comment[] = [
  {
    id: 1,
    authorName: "hy_1234",
    profileImgSrc: "/profile2.svg",
    content: "인정합니다.",
    createdAt: "2025-09-22T10:00:00",
    isAuthor: true, // 글 작성자
    isMine: true, // 내가 쓴 댓글
  },
  {
    id: 3,
    authorName: "hy-123456",
    profileImgSrc: "/profile4.svg",
    content: "인정합니다.",
    createdAt: "2025-09-22T12:00:00",
    isAuthor: false,
    isMine: false, 
  },
];

// 어떤 글의 댓글인지 구분(나중에 api 연동 시 사용)
type CommentSectionNoticeProps = {
  noticeId: number;
};

export default function CommentSectionNotice({ noticeId }: CommentSectionNoticeProps) {
  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now(),
      authorName: "유빈", // TODO: 실제 로그인 유저 정보
      profileImgSrc: "/profile2.svg",
      content,
      createdAt: new Date().toISOString(),
      isAuthor: false,
      isMine: true, // 내가 쓴 댓글
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (id: number, content: string) => {
    // TODO: API 호출
    setComments(
      comments.map((c) => (c.id === id ? { ...c, content } : c))
    );
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleReportComment = (id: number) => {
    // 신고 API 연동
    console.log("댓글 신고:", id);
    alert("신고가 접수되었습니다.");
  };

  return (
    <CommentListNotice
      comments={comments}
      onAddComment={handleAddComment}
      onEditComment={handleEditComment}
      onDeleteComment={handleDeleteComment}
      onReportComment={handleReportComment}
    />
  );
}
