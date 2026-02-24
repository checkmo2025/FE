"use client";

import { useEffect, useState } from "react";
import CommentList, { Comment } from "./comment_list";
import { CommentInfo } from "@/types/story";
import { isValidUrl } from "@/utils/url";
import { useCreateCommentMutation } from "@/hooks/mutations/useStoryMutations";
import { toast } from "react-hot-toast";

// 어떤 글의 댓글인지 구분
type CommentSectionProps = {
  storyId: number;
  initialComments?: CommentInfo[];
  storyAuthorNickname?: string;
};


export default function CommentSection({
  storyId,
  initialComments = [],
  storyAuthorNickname
}: CommentSectionProps) {
  const createCommentMutation = useCreateCommentMutation(storyId);

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

  // 댓글 추가
  const handleAddComment = (content: string) => {
    createCommentMutation.mutate(
      { content },
      {
        onSuccess: () => {
          toast.success("댓글이 등록되었습니다.");
        },
        onError: () => {
          toast.error("댓글 등록에 실패했습니다.");
        }
      }
    );
  };

  // 답글 추가
  const handleAddReply = (parentId: number, content: string) => {
    createCommentMutation.mutate(
      { content, parentCommentId: parentId },
      {
        onSuccess: () => {
          toast.success("답글이 등록되었습니다.");
        },
        onError: () => {
          toast.error("답글 등록에 실패했습니다.");
        }
      }
    );
  };

  const handleEditComment = (id: number, content: string) => {
    // TODO: 댓글 수정 API 연동
  };

  const handleDeleteComment = (id: number) => {
    // TODO: 댓글 삭제 API 연동
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleReportComment = (id: number) => {
    // TODO: 댓글 신고 API 연동
    console.log("댓글 신고:", id);
    toast.success("신고가 접수되었습니다.");
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

