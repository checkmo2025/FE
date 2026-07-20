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
import ReportModal from "@/components/common/modals/report-block/ReportModal";
import { useReportMemberMutation } from "@/hooks/mutations/useMemberMutations";
import { ReportReason } from "@/types/report";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { BLOCKED_USER_MASK } from "@/constants/masking";
import { useBlockStore } from "@/store/useBlockStore";
import { hasErrorCode } from "@/lib/api/errors";
import { useUnsavedChangesNavigation } from "@/hooks/useUnsavedChangesGuard";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import { isTextOverLimit } from "@/utils/inputLimit";

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
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const router = useRouter();
  const { confirmNavigation } = useUnsavedChangesNavigation();
  const { isBlocked: checkLocalBlocked, initializeBlocks } = useBlockStore();

  useEffect(() => {
    if (isLoggedIn) {
      initializeBlocks();
    }
  }, [isLoggedIn, initializeBlocks]);

  // API 데이터를 UI용 Comment 형식으로 변환 및 계층 구조화
  const mapApiToUiComments = (apiComments: CommentInfo[]): Comment[] => {
    // 1. 재귀적으로 맵핑 (백엔드에서 이미 nested 된 replies 배열을 줄 경우를 대비)
    const mapNode = (c: CommentInfo): Comment & { parentCommentId?: number | null } => ({
      id: c.commentId,
      authorName: c.deleted ? "(알 수 없음)" : c.authorInfo?.nickname ?? "(알 수 없음)",
      profileImgSrc: !c.deleted && isValidUrl(c.authorInfo?.profileImageUrl)
        ? c.authorInfo?.profileImageUrl as string
        : DEFAULT_PROFILE_IMAGE,
      content: c.deleted ? "삭제된 댓글입니다." : c.content,
      createdAt: c.createdAt,
      isAuthor: !c.deleted && c.authorInfo?.nickname === storyAuthorNickname,
      isMine: !c.deleted && c.writtenByMe,
      isDeleted: c.deleted,
      // 서버에서 content와 nickname 모두 BLOCKED_USER_MASK로 마스킹하여 내려오거나, 로컬에서 차단한 경우 즉시 마스킹
      isBlocked: !c.deleted && (
        c.authorInfo?.nickname === BLOCKED_USER_MASK ||
        (c.authorInfo?.nickname ? checkLocalBlocked(c.authorInfo.nickname) : false)
      ),
      replies: c.replies ? c.replies.map(r => mapNode(r)) : [],
      parentCommentId: c.parentCommentId,
    });

    const mapped = apiComments.map(mapNode);

    const rootComments: Comment[] = [];
    const commentMap = new Map<number, Comment & { parentCommentId?: number | null }>();

    // 맵에 모든 요소 저장
    const addToMap = (comments: (Comment & { parentCommentId?: number | null })[]) => {
      comments.forEach(c => {
        commentMap.set(c.id, c);
        if (c.replies && c.replies.length > 0) addToMap(c.replies);
      });
    };
    addToMap(mapped);

    // flat list 로 넘어왔을 경우 수동으로 부모-자식 연결
    mapped.forEach((c) => {
      if (c.parentCommentId && commentMap.has(c.parentCommentId)) {
        const parent = commentMap.get(c.parentCommentId)!;
        if (!parent.replies!.find(r => r.id === c.id)) {
          parent.replies!.push(c);
        }
      } else {
        rootComments.push(c);
      }
    });

    // 최상위 댓글 최신순(내림차순) 정렬
    rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 대댓글은 등록순(오름차순) 유지
    const sortReplies = (comments: Comment[]) => {
      comments.forEach(c => {
        if (c.replies && c.replies.length > 0) {
          c.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          sortReplies(c.replies);
        }
      });
    };
    sortReplies(rootComments);

    return rootComments;
  };

  // 댓글/답글 등록 실패 시 공통 에러 핸들러
  const handleCommentError = (err: unknown, defaultMessage: string) => {
    if (hasErrorCode(err) && err.code === "COMMENT_405") {
      toast.error("차단 관계가 있는 회원에게는 댓글을 작성할 수 없습니다.");
      return;
    }
    toast.error(defaultMessage);
  };

  const [comments, setComments] = useState<Comment[]>(() => mapApiToUiComments(initialComments));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetCommentId, setReportTargetCommentId] = useState<number | null>(null);

  // 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setComments(mapApiToUiComments(initialComments));
  }, [initialComments, storyAuthorNickname]);

  // 댓글 추가
  const handleAddComment = (content: string) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    if (
      isTextOverLimit(
        content,
        INPUT_LIMITS.BOOK_STORY_COMMENT,
        `댓글은 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자 이하여야 합니다.`
      )
    ) {
      return;
    }
    createCommentMutation.mutate(
      { content },
      {
        onSuccess: () => {
          toast.success("댓글이 등록되었습니다.");
        },
        onError: (err: unknown) => {
          handleCommentError(err, "댓글 등록에 실패했습니다.");
        }
      }
    );
  };

  // 답글 추가
  const handleAddReply = (parentId: number, content: string) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    if (
      isTextOverLimit(
        content,
        INPUT_LIMITS.BOOK_STORY_COMMENT,
        `댓글은 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자 이하여야 합니다.`
      )
    ) {
      return;
    }
    createCommentMutation.mutate(
      { content, parentCommentId: parentId },
      {
        onSuccess: () => {
          toast.success("답글이 등록되었습니다.");
        },
        onError: (err: unknown) => {
          handleCommentError(err, "답글 등록에 실패했습니다.");
        }
      }
    );
  };

  const handleEditComment = (id: number, content: string) => {
    if (
      isTextOverLimit(
        content,
        INPUT_LIMITS.BOOK_STORY_COMMENT,
        `댓글은 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자 이하여야 합니다.`
      )
    ) {
      return;
    }
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
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
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
      setReportTargetCommentId(targetComment.id);
      setIsReportModalOpen(true);
    }
  };

  const handleReportSubmit = (reason: ReportReason, content: string) => {
    if (reportTargetCommentId != null) {
      reportMember({
        targetType: "BOOK_STORY_COMMENT",
        targetId: String(reportTargetCommentId),
        reason,
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
        onProfileClick={(nickname) => confirmNavigation(() => router.push(`/profile/${nickname}`))}
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
          setReportTargetCommentId(null);
        }}
        onSubmit={handleReportSubmit}
        defaultReason="GENERAL"
      />
    </>
  );
}
