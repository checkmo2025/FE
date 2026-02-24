"use client";

import { useEffect, useState } from "react";
import CommentList, { Comment } from "./comment_list";
import { CommentInfo } from "@/types/story";

// 어떤 글의 댓글인지 구분
type CommentSectionProps = {
  storyId: number;
  initialComments?: CommentInfo[];
  storyAuthorNickname?: string;
};

// URL 유효성 검사 (Swagger 기본값 "string" 또는 빈 값 처리)
const isValidUrl = (url: string | null | undefined) => {
  if (!url || url === "string" || url.trim() === "") return false;
  return url.startsWith("/") || url.startsWith("http");
};

export default function CommentSection({
  storyId,
  initialComments = [],
  storyAuthorNickname
}: CommentSectionProps) {
  // API 데이터를 UI용 Comment 형식으로 변환
  const mapApiToUiComments = (apiComments: CommentInfo[]): Comment[] => {
    return apiComments.map((c) => ({
      id: c.commentId,
      authorName: c.authorInfo.nickname,
      profileImgSrc: isValidUrl(c.authorInfo.profileImageUrl)
        ? c.authorInfo.profileImageUrl
        : "/profile2.svg",
      content: c.content,
      createdAt: c.createdAt,
      isAuthor: c.authorInfo.nickname === storyAuthorNickname,
      isMine: c.writtenByMe,
    }));
  };

  const [comments, setComments] = useState<Comment[]>(() => mapApiToUiComments(initialComments));

  // 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    setComments(mapApiToUiComments(initialComments));
  }, [initialComments, storyAuthorNickname]);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now(),
      authorName: "유빈", // TODO: 실제 로그인 유저 정보 연동 필요
      profileImgSrc: "/profile2.svg",
      content,
      createdAt: new Date().toISOString(),
      isAuthor: false,
      isMine: true,
    };
    setComments([newComment, ...comments]);
  };

  const handleAddReply = (parentId: number, content: string) => {
    // 새 답글 생성
    const newReply: Comment = {
      id: Date.now(),
      authorName: "유빈",
      profileImgSrc: "/profile2.svg",
      content,
      createdAt: new Date().toISOString(),
      isAuthor: false,
      isMine: true,
    };

    // 원래 댓글 찾아서 replies 배열에 답글 추가
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === parentId) {
          // 원래 댓글의 replies 배열에 새 답글 추가
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });
    });
  };

  const handleEditComment = (id: number, content: string) => {

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

