"use client";

import React from "react";
import BookStoryInfiniteList from "@/components/base-ui/BookStory/Common/BookStoryInfiniteList";
import { useOtherMemberInfiniteStoriesQuery, useMyInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import { useAuthStore } from "@/store/useAuthStore";

interface BookStoryListProps {
  nickname?: string; // If provided, fetch other member's stories. Otherwise, fetch "my" stories.
}

export default function BookStoryList({ nickname }: BookStoryListProps) {
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const { mutate: toggleLike } = useToggleStoryLikeMutation();
  const { mutate: toggleFollow } = useToggleFollowMutation();

  const isMyPage = !nickname;

  // Dynamic Query Selection
  const myQuery = useMyInfiniteStoriesQuery();
  const otherQuery = useOtherMemberInfiniteStoriesQuery(nickname || "");
  
  const queryResult = isMyPage ? myQuery : otherQuery;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError
  } = queryResult;

  const handleToggleLike = (bookStoryId: number) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleLike(bookStoryId);
  };

  const handleToggleFollow = (nickname: string, isFollowing: boolean) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleFollow({ nickname, isFollowing });
  };

  const stories = data?.pages.flatMap((page) => page.basicInfoList) || [];

  return (
    <BookStoryInfiniteList
      stories={stories}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      onToggleLike={handleToggleLike}
      onToggleFollow={isMyPage ? undefined : handleToggleFollow}
      hideSubscribeButton={isMyPage}
      emptyMessage={isMyPage ? "작성한 책 이야기가 없습니다." : "작성된 책 이야기가 없습니다."}
      errorMessage={isMyPage ? "책 이야기를 불러오는 데 실패했습니다." : "책 이야기를 불러오는 중 오류가 발생했습니다."}
    />
  );
}
