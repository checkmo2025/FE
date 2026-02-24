"use client";

import { useEffect, useState } from "react";
import CommentList, { Comment } from "./comment_list";
import { CommentInfo } from "@/types/story";
import { isValidUrl } from "@/utils/url";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation
} from "@/hooks/mutations/useStoryMutations";
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
  const updateCommentMutation = useUpdateCommentMutation(storyId);
  const deleteCommentMutation = useDeleteCommentMutation(storyId);

  // API 데이터를 UI용 Comment 형식으로 변환 및 계층 구조화
  const mapApiToUiComments = (apiComments: CommentInfo[]): Comment[] => {
    const flatComments: Comment[] = apiComments.map((c) => ({
      id: c.commentId,
      authorName: c.authorInfo.nickname,
      profileImgSrc: isValidUrl(c.authorInfo.profileImageUrl)
        ? c.authorInfo.profileImageUrl
        : "/profile2.svg",
      content: c.content,
      createdAt: c.createdAt,
      isAuthor: c.authorInfo.nickname === storyAuthorNickname,
      isMine: c.writtenByMe,
      replies: [],
    }));

    const rootComments: Comment[] = [];
    const commentMap = new Map<number, Comment>();

    flatComments.forEach(c => commentMap.set(c.id, c));

    apiComments.forEach((c, index) => {
      const uiComment = flatComments[index];
      if (c.parentCommentId && commentMap.has(c.parentCommentId)) {
        commentMap.get(c.parentCommentId)!.replies!.push(uiComment);
      } else {
        rootComments.push(uiComment);
      }
    });

    // 최상위 댓글 최신순(내림차순) 정렬
    rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 대댓글은 등록순(오름차순) 유지 (일반적인 UI 패턴)
    rootComments.forEach(c => {
      c.replies?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return rootComments;
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
    updateCommentMutation.mutate(
      { commentId: id, content },
      {
        onSuccess: () => {
          toast.success("댓글이 수정되었습니다.");
        },
        onError: () => {
          toast.error("댓글 수정에 실패했습니다.");
        }
      }
    );
  };

  const handleDeleteComment = (id: number) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(id, {
        onSuccess: () => {
          toast.success("댓글이 삭제되었습니다.");
        },
        onError: () => {
          toast.error("댓글 삭제에 실패했습니다.");
        }
      });
    }
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

