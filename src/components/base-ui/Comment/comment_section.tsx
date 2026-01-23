"use client";

import { useState } from "react";
import CommentList, { Comment } from "./comment_list";

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
    replies: [
      {
        id: 2,
        authorName: "hy-12345",
        profileImgSrc: "/profile3.svg",
        content: "인정합니다.",
        createdAt: "2025-09-22T11:00:00",
        isAuthor: false,
        isMine: false, // 남이 쓴 댓글
      },
    ],
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
type CommentSectionProps = {
  storyId: number;
};

export default function CommentSection({ storyId }: CommentSectionProps) {
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

  const handleAddReply = (parentId: number, content: string) => {
    // TODO: 대댓글 입력 UI 구현 필요
    console.log("대댓글 추가:", parentId, content);
  };

  const handleEditComment = (id: number, content: string) => {
    // TODO: 수정 UI 구현 필요
    console.log("댓글 수정:", id, content);
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleReportComment = (id: number) => {
    // TODO: 신고 API 연동
    console.log("댓글 신고:", id);
    alert("신고가 접수되었습니다.");
  };

  return (
    <CommentList
      comments={comments}
      onAddComment={handleAddComment}
      onAddReply={handleAddReply}
      onEditComment={handleEditComment}
      onDeleteComment={handleDeleteComment}
      onReportComment={handleReportComment}
    />
  );
}

