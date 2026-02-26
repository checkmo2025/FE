"use client";

import React, { useEffect } from "react";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import { useMyInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useInView } from "react-intersection-observer";

const MyBookStoryList = () => {
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

      {isLoading && <p className="text-Gray-4 text-center py-4">로딩 중...</p>}

      {!isLoading && isError && (
        <p className="text-red-500 text-center py-4">책 이야기를 불러오는 데 실패했습니다.</p>
      )}

      {!isLoading && !isError && stories.length === 0 && (
        <p className="text-Gray-4 text-center py-4">작성한 책 이야기가 없습니다.</p>
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
        <p className="text-Gray-4 text-center py-4">추가 이야기를 불러오는 중...</p>
      )}
    </div>
  );
};

export default MyBookStoryList;
