"use client";

import { useEffect, useState } from "react";
import CommentList, { Comment } from "@/components/base-ui/Comment/comment_list";
import { CommentInfo } from "@/types/story";
import { isValidUrl } from "@/utils/url";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
} from "@/hooks/mutations/useStoryMutations";
import { deleteAdminComment } from "@/lib/api/admin/stories";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import ReportModal from "@/components/common/ReportModal";
import { useReportMemberMutation } from "@/hooks/mutations/useMemberMutations";
import { ReportType } from "@/types/member";
import { useAuthStore } from "@/store/useAuthStore";

type CommentSectionProps = {
  storyId: number;
  initialComments?: CommentInfo[];
  storyAuthorNickname?: string;
};

export default function CommentSection({
  storyId,
  initialComments = [],
  storyAuthorNickname,
}: CommentSectionProps) {
  const createCommentMutation = useCreateCommentMutation(storyId);
  const updateCommentMutation = useUpdateCommentMutation(storyId);
  const { mutate: reportMember } = useReportMemberMutation();
  const { isLoggedIn, openLoginModal } = useAuthStore();

  const mapApiToUiComments = (apiComments: CommentInfo[]): Comment[] => {
    const mapNode = (
      c: CommentInfo
    ): (Comment & { parentCommentId?: number | null }) | null => {
      if (!c.authorInfo) return null;

      const mappedReplies = c.replies
        ? c.replies
            .map((r) => mapNode(r))
            .filter(
              (
                reply
              ): reply is Comment & { parentCommentId?: number | null } =>
                reply !== null
            )
        : [];

      return {
        id: c.commentId,
        authorName: c.authorInfo.nickname,
        profileImgSrc: isValidUrl(c.authorInfo.profileImageUrl)
          ? c.authorInfo.profileImageUrl
          : "/profile2.svg",
        content: c.content,
        createdAt: c.createdAt,
        isAuthor: c.authorInfo.nickname === storyAuthorNickname,
        isMine: c.writtenByMe,
        replies: mappedReplies,
        parentCommentId: c.parentCommentId,
      };
    };

    const mapped = apiComments
      .map(mapNode)
      .filter(
        (
          comment
        ): comment is Comment & { parentCommentId?: number | null } =>
          comment !== null
      );

    const rootComments: Comment[] = [];
    const commentMap = new Map<
      number,
      Comment & { parentCommentId?: number | null }
    >();

    const addToMap = (
      comments: (Comment & { parentCommentId?: number | null })[]
    ) => {
      comments.forEach((c) => {
        commentMap.set(c.id, c);
        if (c.replies && c.replies.length > 0) addToMap(c.replies);
      });
    };
    addToMap(mapped);

    mapped.forEach((c) => {
      if (c.parentCommentId && commentMap.has(c.parentCommentId)) {
        const parent = commentMap.get(c.parentCommentId)!;
        if (!parent.replies?.find((r) => r.id === c.id)) {
          parent.replies = [...(parent.replies ?? []), c];
        }
      } else {
        rootComments.push(c);
      }
    });

    rootComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const sortReplies = (comments: Comment[]) => {
      comments.forEach((c) => {
        if (c.replies && c.replies.length > 0) {
          c.replies.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          sortReplies(c.replies);
        }
      });
    };
    sortReplies(rootComments);

    return rootComments;
  };

  const [comments, setComments] = useState<Comment[]>(() =>
    mapApiToUiComments(initialComments)
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetNickname, setReportTargetNickname] = useState<string>("");

  useEffect(() => {
    setComments(mapApiToUiComments(initialComments));
  }, [initialComments, storyAuthorNickname]);

  const removeCommentById = (
    commentList: Comment[],
    targetId: number
  ): Comment[] => {
    return commentList
      .filter((comment) => comment.id !== targetId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies
          ? removeCommentById(comment.replies, targetId)
          : [],
      }));
  };

  const handleAddComment = (content: string) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    createCommentMutation.mutate(
      { content },
      {
        onSuccess: () => {
          toast.success("댓글이 등록되었습니다.");
        },
        onError: () => {
          toast.error("댓글 등록에 실패했습니다.");
        },
      }
    );
  };

  const handleAddReply = (parentId: number, content: string) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    createCommentMutation.mutate(
      { content, parentCommentId: parentId },
      {
        onSuccess: () => {
          toast.success("답글이 등록되었습니다.");
        },
        onError: () => {
          toast.error("답글 등록에 실패했습니다.");
        },
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
        },
      }
    );
  };

  const handleDeleteComment = (id: number) => {
    setCommentToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete === null) return;

    try {
        await deleteAdminComment(storyId, commentToDelete);
        setComments((prev) => removeCommentById(prev, commentToDelete));
        toast.success("댓글이 삭제되었습니다.");
    }   catch (error) {
        toast.error("댓글 삭제에 실패했습니다.");
    }   finally {
        setIsConfirmOpen(false);
        setCommentToDelete(null);
    }
  };

  const handleReportComment = (id: number) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    let targetComment: Comment | undefined;

    for (const c of comments) {
      if (c.id === id) {
        targetComment = c;
        break;
      }
      if (c.replies) {
        const found = c.replies.find((r) => r.id === id);
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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportTargetNickname("");
        }}
        onSubmit={handleReportSubmit}
        defaultReportType="책이야기(댓글)"
      />
    </>
  );
}