"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import CommentListNotice, { Comment } from "./comment_list_notice";
import ConfirmModal from "@/components/common/ConfirmModal";
import ReportModal from "@/components/common/ReportModal";

import { useAuthStore } from "@/store/useAuthStore";
import { useClubNoticeCommentsInfiniteQuery } from "@/hooks/queries/useClubNoticeCommentQueries";
import {
  useCreateClubNoticeCommentMutation,
  useUpdateClubNoticeCommentMutation,
  useDeleteClubNoticeCommentMutation,
} from "@/hooks/mutations/useClubNoticeCommentMutations";
import { useReportMemberMutation } from "@/hooks/mutations/useReportMemberMutations";

type CommentSectionNoticeProps = {
  noticeId: number;
  isAdminView?: boolean;
};

function mapReportTypeToApi(
  type: string
): "GENERAL" | "BOOK_STORY" {
  switch (type) {
    case "책 이야기":
    case "책이야기(댓글)":
      return "BOOK_STORY";
    case "일반":
    case "책모임 내부":
    default:
      return "GENERAL";
  }
}

export default function CommentSectionNotice({
  noticeId,
  isAdminView = false,
}: CommentSectionNoticeProps) {
  const params = useParams();
  const router = useRouter();
  const clubId = Number(params.id);

  const { user } = useAuthStore();
  const myName = user?.nickname ?? "";

  const commentsQuery = useClubNoticeCommentsInfiniteQuery(clubId, noticeId, {
    enabled: Number.isFinite(clubId) && Number.isFinite(noticeId),
  });

  const { mutateAsync: createComment } = useCreateClubNoticeCommentMutation();
  const { mutateAsync: updateComment } = useUpdateClubNoticeCommentMutation();
  const { mutateAsync: deleteComment } = useDeleteClubNoticeCommentMutation();
  const { mutateAsync: reportMember } = useReportMemberMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [reportTarget, setReportTarget] = useState<{
    commentId: number;
    reportedMemberNickname: string;
  } | null>(null);

  const comments = useMemo<Comment[]>(() => {
    const list = commentsQuery.data?.pages.flatMap((page) => page.comments) ?? [];

    return list.map((comment) => {
      const isMine =
        !!myName && comment.authorInfo.nickname === myName;

      const canManage = isAdminView || isMine;

      return {
        id: comment.commentId,
        authorName: comment.authorInfo.nickname,
        profileImgSrc: comment.authorInfo.profileImageUrl || undefined,
        content: comment.content,
        createdAt: comment.createdAt,

        isAuthor: isMine,
        isMine,

        canEdit: canManage,
        canDelete: canManage,
        canReport: !canManage,
      };
    });
  }, [commentsQuery.data, myName, isAdminView]);

  const handleAddComment = async (content: string) => {
    const trimmed = content.trim();

    if (!trimmed) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    if (!Number.isFinite(clubId) || !Number.isFinite(noticeId)) {
      toast.error("잘못된 접근입니다.");
      return;
    }

    try {
      await createComment({
        clubId,
        noticeId,
        body: { content: trimmed },
      });

      toast.success("댓글이 등록되었습니다.");
    } catch (e: any) {
      const msg = e?.message ?? "";
      toast.error(msg || "댓글 등록에 실패했습니다.");
    }
  };

  const handleEditComment = async (id: number, content: string) => {
    const trimmed = content.trim();

    if (!trimmed) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    if (!Number.isFinite(clubId) || !Number.isFinite(noticeId)) {
      toast.error("잘못된 접근입니다.");
      return;
    }

    try {
      await updateComment({
        clubId,
        noticeId,
        commentId: id,
        body: { content: trimmed },
      });

      toast.success("댓글이 수정되었습니다.");
    } catch (e: any) {
      const msg = e?.message ?? "";
      toast.error(msg || "댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    const targetId = deleteTargetId;
    if (targetId === null) return;

    if (!Number.isFinite(clubId) || !Number.isFinite(noticeId)) {
      toast.error("잘못된 접근입니다.");
      return;
    }

    try {
      await deleteComment({
        clubId,
        noticeId,
        commentId: targetId,
      });

      toast.success("댓글이 삭제되었습니다.");
    } catch (e: any) {
      const msg = e?.message ?? "";
      toast.error(msg || "댓글 삭제에 실패했습니다.");
    }
  };

  const handleReportComment = (id: number) => {
    const target = comments.find((comment) => comment.id === id);

    if (!target) {
      toast.error("신고할 댓글을 찾을 수 없습니다.");
      return;
    }

    setReportTarget({
      commentId: id,
      reportedMemberNickname: target.authorName,
    });
  };

  const handleSubmitReport = async (type: string, content: string) => {
    const target = reportTarget;
    if (!target) return;

    try {
      await reportMember({
        reportedMemberNickname: target.reportedMemberNickname,
        reportType: mapReportTypeToApi(type),
        content,
      });

      toast.success("신고가 접수되었습니다.");
    } catch (e: any) {
      const msg = e?.message ?? "";
      toast.error(msg || "신고 접수에 실패했습니다.");
    }
  };

  const handleLoadMore = () => {
    if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
      commentsQuery.fetchNextPage();
    }
  };

  if (!Number.isFinite(clubId) || !Number.isFinite(noticeId)) {
    return <div>잘못된 접근입니다.</div>;
  }

  if (commentsQuery.isLoading) {
    return <div>댓글을 불러오는 중...</div>;
  }

  if (commentsQuery.isError) {
    return <div>댓글을 불러오지 못했습니다.</div>;
  }

  return (
    <>
      <CommentListNotice
        comments={comments}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onReportComment={handleReportComment}
        onProfileClick={(nickname) => router.push(`/profile/${nickname}`)}
        onLoadMore={handleLoadMore}
        hasNextPage={!!commentsQuery.hasNextPage}
        isFetchingNextPage={!!commentsQuery.isFetchingNextPage}
      />

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        message={"댓글을 삭제하시겠습니까?"}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ReportModal
        isOpen={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        onSubmit={handleSubmitReport}
        defaultReportType="일반"
      />
    </>
  );
}