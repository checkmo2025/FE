"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookStoryCard from "./items/AdminBookStoryCard";
import ConfirmModal from "@/components/base-ui/Admin/ConfirmModal";
import Toast from "@/components/base-ui/Admin/Toast";
import { useInView } from "react-intersection-observer";
import {
  fetchAdminMemberBookStories,
  type AdminMemberBookStoryItem,
} from "@/lib/api/admin/member";
import { deleteAdminBookStory } from "@/lib/api/admin/stories";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 닉네임 */
  memberNickname: string;
};

const BookStoryList = ({ memberNickname }: Props) => {
  const router = useRouter();

  const [stories, setStories] = useState<AdminMemberBookStoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState("");

  const { ref, inView } = useInView();

  useEffect(() => {
    const loadInitialStories = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await fetchAdminMemberBookStories(memberNickname, null);

        setStories(res.result.basicInfoList ?? []);
        setHasNext(res.result.hasNext ?? false);
        setNextCursor(res.result.nextCursor ?? null);
      } catch (error) {
        console.error("회원 책이야기 조회 실패:", error);
        setStories([]);
        setHasNext(false);
        setNextCursor(null);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialStories();
  }, [memberNickname]);

  useEffect(() => {
    const loadMoreStories = async () => {
      if (!inView || !hasNext || nextCursor === null || isFetchingNextPage) {
        return;
      }

      try {
        setIsFetchingNextPage(true);

        const res = await fetchAdminMemberBookStories(
          memberNickname,
          nextCursor
        );

        setStories((prev) => [...prev, ...(res.result.basicInfoList ?? [])]);
        setHasNext(res.result.hasNext ?? false);
        setNextCursor(res.result.nextCursor ?? null);
      } catch (error) {
        console.error("회원 책이야기 추가 조회 실패:", error);
      } finally {
        setIsFetchingNextPage(false);
      }
    };

    loadMoreStories();
  }, [inView, hasNext, nextCursor, isFetchingNextPage, memberNickname]);

  const handleDeleteClick = (bookStoryId: number) => {
    setSelectedStoryId(bookStoryId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedStoryId === null) return;

    try {
      await deleteAdminBookStory(selectedStoryId);
      setStories((prev) =>
        prev.filter((story) => story.bookStoryId !== selectedStoryId)
      );
      setToastMessage("책 이야기 삭제 성공");
      setSelectedStoryId(null);
    } catch (error) {
      console.error("책이야기 삭제 실패:", error);
      setToastMessage("책 이야기 삭제 실패");
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStoryId(null);
  };

  const handleCloseToast = () => {
    setToastMessage("");
  };

  const handleMoveToDetail = (bookStoryId: number) => {
    router.push(`/admin/stories/${bookStoryId}`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-[1048px] mx-auto gap-[20px] px-[18px] md:px-[40px] lg:px-0">
        {isLoading && (
          <p className="text-Gray-4 text-center py-4">로딩 중...</p>
        )}

        {!isLoading && isError && (
          <p className="text-red-500 text-center py-4">
            멤버 책 이야기 불러오기 실패
          </p>
        )}

        {!isLoading && !isError && stories.length === 0 && (
          <p className="text-Gray-4 text-center py-4">
            멤버 책 이야기 없음
          </p>
        )}

        {!isLoading && !isError && stories.length > 0 && (
          <div className="grid grid-cols-2 min-[540px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[12px] lg:gap-[20px] w-fit">
            {stories.map((story) => (
              <BookStoryCard
                key={story.bookStoryId}
                authorName={story.authorInfo.nickname}
                createdAt={story.createdAt}
                viewCount={story.viewCount}
                title={story.bookStoryTitle}
                content={story.description}
                likeCount={story.likes}
                commentCount={story.commentCount}
                coverImgSrc={story.bookInfo.imgUrl}
                profileImgSrc={story.authorInfo.profileImageUrl}
                hideSubscribeButton={true}
                hideDeleteButton={false}
                onDeleteClick={() => handleDeleteClick(story.bookStoryId)}
                onClick={() => handleMoveToDetail(story.bookStoryId)}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && hasNext && (
          <div ref={ref} className="h-4 w-full" />
        )}

        {isFetchingNextPage && (
          <p className="text-Gray-4 text-center py-4">
            추가 이야기를 불러오는 중...
          </p>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="해당 책 이야기를 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default BookStoryList;