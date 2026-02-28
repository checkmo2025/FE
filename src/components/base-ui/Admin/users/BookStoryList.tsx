"use client";

import React, { useEffect } from "react";
import BookStoryCard from "./items/AdminBookStoryCard";
import { useMyInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useInView } from "react-intersection-observer";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 ID (현재는 구조만 맞추기 위해 받음) */
  userId: string;
};

const BookStoryList = ({ userId }: Props) => {
  /**
   * TODO:
   * 관리자 전용 "특정 사용자(userId) 책 이야기 목록" API/쿼리가 아직 없어서
   * 임시로 "내 책 이야기" 쿼리를 사용 중입니다.
   * 추후 useUserInfiniteStoriesQuery(userId) 같은 형태로 교체 예정.
   *
   * - 현재 userId는 props로 받고만 있으며, 쿼리 교체 시 사용됩니다.
   */
  void userId;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useMyInfiniteStoriesQuery();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const stories = data?.pages.flatMap((page) => page.basicInfoList) || [];

  return (
    <div className="flex flex-col items-center w-full max-w-[1048px] mx-auto gap-[20px] px-[18px] md:px-[40px] lg:px-0">
      {isLoading && (
        <p className="text-Gray-4 text-center py-4">로딩 중...</p>
      )}

      {!isLoading && isError && (
        <p className="text-red-500 text-center py-4">
          책 이야기를 불러오는 데 실패했습니다.
        </p>
      )}

      {!isLoading && !isError && stories.length === 0 && (
        <p className="text-Gray-4 text-center py-4">
          작성한 책 이야기가 없습니다.
        </p>
      )}

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
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-4 w-full" />

      {isFetchingNextPage && (
        <p className="text-Gray-4 text-center py-4">
          추가 이야기를 불러오는 중...
        </p>
      )}
    </div>
  );
};

export default BookStoryList;