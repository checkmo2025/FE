"use client";

import React from "react";
import BookStoryInfiniteList from "@/components/base-ui/BookStory/Common/BookStoryInfiniteList";
import { useMyInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";

const MyBookStoryList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useMyInfiniteStoriesQuery();

  const { mutate: toggleLike } = useToggleStoryLikeMutation();

  const stories = data?.pages.flatMap((page) => page.basicInfoList) || [];

  return (
    <BookStoryInfiniteList
      stories={stories}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      onToggleLike={(id) => toggleLike(id)}
      hideSubscribeButton={true}
      emptyMessage="작성한 책 이야기가 없습니다."
      errorMessage="책 이야기를 불러오는 데 실패했습니다."
    />
  );
};

export default MyBookStoryList;
