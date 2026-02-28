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
import ConfirmModal from "@/components/common/ConfirmModal";
import ReportModal from "@/components/common/ReportModal";
import { useReportMemberMutation } from "@/hooks/mutations/useMemberMutations";
import { ReportType } from "@/types/member";

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
  const { mutate: reportMember } = useReportMemberMutation();

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetNickname, setReportTargetNickname] = useState<string>("");

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
    setCommentToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (commentToDelete === null) return;
    deleteCommentMutation.mutate(commentToDelete, {
      onSuccess: () => {
        toast.success("댓글이 삭제되었습니다.");
        setIsConfirmOpen(false);
        setCommentToDelete(null);
      },
      onError: () => {
        toast.error("댓글 삭제에 실패했습니다.");
        setIsConfirmOpen(false);
        setCommentToDelete(null);
      }
    });
  };

  const handleReportComment = (id: number) => {
    // 찾기: 최상단 댓글과 대댓글 모두 탐색
    let targetComment: Comment | undefined;

    for (const c of comments) {
      if (c.id === id) {
        targetComment = c;
        break;
      }
      if (c.replies) {
        const found = c.replies.find(r => r.id === id);
        if (found) {
          targetComment = found;
          break;
        }
      }
    }

    if (targetComment) {
      setReportTargetNickname(targetComment.authorName);
      setIsReportModalOpen(true);
    }
  };

  const handleReportSubmit = (type: string, content: string) => {
    let mappedType: ReportType = "GENERAL";
    if (type === "책 이야기") mappedType = "BOOK_STORY";
    if (type === "책이야기(댓글)") mappedType = "COMMENT";
    if (type === "책모임 내부") mappedType = "CLUB_MEETING";

    if (reportTargetNickname) {
      reportMember({
        reportedMemberNickname: reportTargetNickname,
        reportType: mappedType,
        content,
      });
    }
  };

  return (
    <>
      <CommentList
        comments={comments}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onReportComment={handleReportComment}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        message="댓글을 삭제하시겠습니까?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setCommentToDelete(null);
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportTargetNickname("");
        }}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}

