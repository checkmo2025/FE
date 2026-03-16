"use client";

import React from "react";
import BookStoryInfiniteList from "@/components/base-ui/BookStory/Common/BookStoryInfiniteList";
import { useOtherMemberInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import { useAuthStore } from "@/store/useAuthStore";

export default function BookStoryList({ nickname }: { nickname: string }) {
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const { mutate: toggleLike } = useToggleStoryLikeMutation();
  const { mutate: toggleFollow } = useToggleFollowMutation();

  const decodedNickname = decodeURIComponent(nickname);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError
  } = useOtherMemberInfiniteStoriesQuery(decodedNickname);

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
      onToggleFollow={handleToggleFollow}
      emptyMessage="작성된 책 이야기가 없습니다."
      errorMessage="책 이야기를 불러오는 중 오류가 발생했습니다."
    />
  );
}
