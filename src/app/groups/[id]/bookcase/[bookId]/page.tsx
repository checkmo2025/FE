/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import toast from "react-hot-toast";

import BookDetailCard from "@/components/base-ui/Bookcase/BookDetailCard";
import BookDetailNav, { Tab as TabKey } from "@/components/base-ui/Bookcase/BookDetailNav";
import DebateSection from "./DebateSection";
import ReviewSection from "./ReviewSection";
import MeetingTabSection from "./MeetingTabSection";

import BookshelfDeleteConfirmModal from "@/components/base-ui/Bookcase/bookid/BookshelfDeleteConfirmModal";
import ReportModal from "@/components/common/ReportModal";

import { useClubMeQuery } from "@/hooks/queries/useClubhomeQueries";
import {
  useBookshelfDetailQuery,
  useBookshelfTopicsInfiniteQuery,
  useBookshelfReviewsInfiniteQuery,
} from "@/hooks/queries/useClubsBookshelfQueries";
import {
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useDeleteBookshelfMutation,
} from "@/hooks/mutations/useClubsBookshelfMutations";
import { useReportMemberMutation } from "@/hooks/mutations/useReportMemberMutations";

import { useAuthStore } from "@/store/useAuthStore";

function isTabKey(v: string | null): v is TabKey {
  return v === "topic" || v === "review" || v === "meeting";
}

function mapReportTypeToApi(type: string): "GENERAL" | "BOOK_STORY" {
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

export default function BookDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const groupIdParam = params.id as string;
  const clubId = Number(groupIdParam);

  const meetingIdParam = (params.meetingId ?? params.bookId) as string;
  const meetingId = Number(meetingIdParam);

  const [activeTab, setActiveTab] = useState<TabKey>("meeting");

  const { user } = useAuthStore();

  const myName = user?.nickname ?? "My_Name";
  const myProfileImageUrl = user?.profileImageUrl ?? "/profile4.svg";

  const [isDebateWriting, setIsDebateWriting] = useState(false);
  const [isReviewWriting, setIsReviewWriting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    reportedMemberNickname: string;
  } | null>(null);

  const { data: meData } = useClubMeQuery(clubId);
  const isStaff = !!meData?.staff;

  const {
    data: bookshelfDetail,
    isLoading: isBookshelfLoading,
    isError: isBookshelfError,
  } = useBookshelfDetailQuery(clubId, meetingId);

  const topicsQuery = useBookshelfTopicsInfiniteQuery(clubId, meetingId);
  const reviewsQuery = useBookshelfReviewsInfiniteQuery(clubId, meetingId);

  const { mutate: createTopic } = useCreateTopicMutation();
  const { mutate: updateTopic } = useUpdateTopicMutation();
  const { mutate: deleteTopic } = useDeleteTopicMutation();

  const { mutate: createReview } = useCreateReviewMutation();
  const { mutate: updateReview } = useUpdateReviewMutation();
  const { mutate: deleteReview } = useDeleteReviewMutation();

  const { mutateAsync: deleteBookshelf, isPending: isDeletingBookshelf } =
    useDeleteBookshelfMutation();

  const { mutateAsync: reportMember } = useReportMemberMutation();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (isTabKey(tab) && tab !== activeTab) setActiveTab(tab);

    if (!tab) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("tab", "meeting");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", tab);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const meetingNameForQuery = useMemo(() => {
    return bookshelfDetail?.bookDetailInfo?.title ?? "";
  }, [bookshelfDetail?.bookDetailInfo?.title]);

  const handleManageTeams = () => {
    router.push(
      `/groups/${groupIdParam}/admin/bookcase/${meetingId}?meetingName=${encodeURIComponent(meetingNameForQuery)}`
    );
  };

  const handleEditBookshelf = () => {
    router.push(`/groups/${groupIdParam}/admin/bookcase/${meetingId}/edit`);
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    if (isDeletingBookshelf) return;
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDeleteBookshelf = async () => {
    try {
      await deleteBookshelf({ clubId, meetingId });
      setIsDeleteModalOpen(false);
      toast.success("삭제되었습니다.");
      router.push(`/groups/${groupIdParam}/bookcase`);
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const mappedBook = useMemo(() => {
    if (!bookshelfDetail) return null;
    const { meetingInfo, bookDetailInfo } = bookshelfDetail;

    return {
      title: bookDetailInfo.title,
      author: bookDetailInfo.author,
      imageUrl: bookDetailInfo.imgUrl,
      description: bookDetailInfo.description,
      category: {
        generation: `${meetingInfo.generation}기`,
        genre: meetingInfo.tag,
      },
      rating: meetingInfo.averageRate,
    };
  }, [bookshelfDetail]);

  const topicItems = useMemo(() => {
    const list = topicsQuery.data?.pages.flatMap((p) => p.topicDetailList) ?? [];
    return list.map((t) => ({
      id: t.topicId,
      name: t.authorInfo.nickname,
      content: t.content,
      profileImageUrl: t.authorInfo.profileImageUrl ?? null,
      isAuthor: t.isAuthor,
    }));
  }, [topicsQuery.data]);

  const reviewItems = useMemo(() => {
    const list = reviewsQuery.data?.pages.flatMap((p) => p.bookReviewDetailList) ?? [];
    return list.map((r) => ({
      id: r.bookReviewId,
      name: r.authorInfo.nickname,
      content: r.description,
      rating: r.rate,
      profileImageUrl: r.authorInfo.profileImageUrl ?? null,
      isAuthor: r.isAuthor,
    }));
  }, [reviewsQuery.data]);

  const handleClickAuthor = (nickname: string) => {
    router.push(`/profile/${nickname}`);
  };

  const handleOpenTopicReport = (id: number | string) => {
    const target = topicItems.find((item) => String(item.id) === String(id));

    if (!target) {
      toast.error("신고할 발제를 찾을 수 없습니다.");
      return;
    }

    if (isStaff || target.isAuthor) {
      toast.error("신고할 수 없는 항목입니다.");
      return;
    }

    setReportTarget({
      reportedMemberNickname: target.name,
    });
  };

  const handleOpenReviewReport = (id: number | string) => {
    const target = reviewItems.find((item) => String(item.id) === String(id));

    if (!target) {
      toast.error("신고할 한줄평을 찾을 수 없습니다.");
      return;
    }

    if (isStaff || target.isAuthor) {
      toast.error("신고할 수 없는 항목입니다.");
      return;
    }

    setReportTarget({
      reportedMemberNickname: target.name,
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

  return (
    <div className="flex flex-col w-full items-start gap-[24px]">
      <BookshelfDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        isPending={isDeletingBookshelf}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDeleteBookshelf}
        title="책장을 삭제할까요?"
        description="(공지사항도 함께 삭제됩니다)"
        confirmText="예"
        cancelText="아니요"
      />

      <ReportModal
        isOpen={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        onSubmit={handleSubmitReport}
        defaultReportType="책모임 내부"
      />

      <div className="flex flex-col w-full items-start gap-[40px]">
        {isBookshelfLoading && <div className="w-full body_1_2 text-Gray-4">불러오는 중...</div>}
        {isBookshelfError && (
          <div className="w-full body_1_2 text-Red-500">책장 상세 조회에 실패했습니다.</div>
        )}

        {mappedBook && (
          <BookDetailCard
            title={mappedBook.title}
            author={mappedBook.author}
            imageUrl={mappedBook.imageUrl}
            description={mappedBook.description}
            category={mappedBook.category}
            rating={mappedBook.rating}
            isStaff={isStaff}
            isDeletingBookshelf={isDeletingBookshelf}
            onEditBookshelf={handleEditBookshelf}
            onDeleteBookshelf={openDeleteModal}
          />
        )}

        <div className="flex w-full flex-col items-start gap-[24px] self-stretch">
          <BookDetailNav activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="flex flex-col items-start gap-[24px] self-stretch">
            {activeTab === "meeting" && (
              <MeetingTabSection
                clubId={clubId}
                meetingId={meetingId}
                onManageTeamsClick={handleManageTeams}
              />
            )}

            {activeTab === "topic" && (
              <DebateSection
                myName={myName}
                myProfileImageUrl={myProfileImageUrl}
                defaultProfileUrl="/profile4.svg"
                isStaff={isStaff}
                isWriting={isDebateWriting}
                onToggleWriting={() => setIsDebateWriting((v) => !v)}
                onSendDebate={(text) => {
                  createTopic(
                    { clubId, meetingId, body: { description: text } },
                    {
                      onSuccess: () => {
                        toast.success("발제가 등록되었습니다.");
                        setIsDebateWriting(false);
                      },
                      onError: () => toast.error("발제 등록에 실패했습니다."),
                    }
                  );
                  return true;
                }}
                items={topicItems}
                hasNextPage={!!topicsQuery.hasNextPage}
                isFetchingNextPage={topicsQuery.isFetchingNextPage}
                onLoadMore={topicsQuery.fetchNextPage}
                onReport={handleOpenTopicReport}
                onUpdate={(id, nextContent) => {
                  updateTopic(
                    { clubId, meetingId, topicId: Number(id), body: { description: nextContent } },
                    {
                      onSuccess: () => toast.success("수정되었습니다."),
                      onError: () => toast.error("수정에 실패했습니다."),
                    }
                  );
                }}
                onDelete={(id) => {
                  deleteTopic(
                    { clubId, meetingId, topicId: Number(id) },
                    {
                      onSuccess: () => toast.success("삭제되었습니다."),
                      onError: () => toast.error("삭제에 실패했습니다."),
                    }
                  );
                }}
                onClickAuthor={handleClickAuthor}
              />
            )}

            {activeTab === "review" && (
              <ReviewSection
                myName={myName}
                myProfileImageUrl={myProfileImageUrl}
                defaultProfileUrl="/profile4.svg"
                isStaff={isStaff}
                isWriting={isReviewWriting}
                onToggleWriting={() => setIsReviewWriting((v) => !v)}
                onSendReview={(text, rating) => {
                  createReview(
                    { clubId, meetingId, body: { description: text, rate: rating } },
                    {
                      onSuccess: () => {
                        toast.success("한줄평이 등록되었습니다.");
                        setIsReviewWriting(false);
                      },
                      onError: () => toast.error("한줄평 등록에 실패했습니다."),
                    }
                  );
                  return true;
                }}
                items={reviewItems}
                hasNextPage={!!reviewsQuery.hasNextPage}
                isFetchingNextPage={reviewsQuery.isFetchingNextPage}
                onLoadMore={reviewsQuery.fetchNextPage}
                onReport={handleOpenReviewReport}
                onUpdate={(id, nextContent, nextRating) => {
                  updateReview(
                    {
                      clubId,
                      meetingId,
                      reviewId: Number(id),
                      body: { description: nextContent, rate: nextRating },
                    },
                    {
                      onSuccess: () => toast.success("수정되었습니다."),
                      onError: () => toast.error("수정에 실패했습니다."),
                    }
                  );
                }}
                onDelete={(id) => {
                  deleteReview(
                    { clubId, meetingId, reviewId: Number(id) },
                    {
                      onSuccess: () => toast.success("삭제되었습니다."),
                      onError: () => toast.error("삭제에 실패했습니다."),
                    }
                  );
                }}
                onClickAuthor={handleClickAuthor}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}