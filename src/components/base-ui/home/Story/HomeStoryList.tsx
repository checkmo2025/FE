"use client";

import React from "react";
import BookStoryInfiniteList from "@/components/base-ui/BookStory/Common/BookStoryInfiniteList";
import ListSubscribeLarge from "@/components/base-ui/home/Recommendation/list_subscribe_large";
import { useInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { RecommendedMember } from "@/types/member";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface HomeStoryListProps {
  recommendedUsers: RecommendedMember[];
  isErrorMembers: boolean;
  isLoadingMembers?: boolean;
  onToggleFollow: (nickname: string, isFollowing: boolean) => void;
}

const HomeStoryList: React.FC<HomeStoryListProps> = ({
  recommendedUsers,
  isErrorMembers,
  isLoadingMembers,
  onToggleFollow,
}) => {
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const router = useRouter();

  // Breakpoints from tailwind.config.js
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1440px)");

  const {
    data: storiesData,
    isLoading: isLoadingStories,
    isError: isErrorStories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteStoriesQuery();

  const { mutate: toggleLike } = useToggleStoryLikeMutation();

  const handleToggleLike = (bookStoryId: number) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleLike(bookStoryId);
  };

  const stories = storiesData?.pages.flatMap((page) => page.basicInfoList) || [];

  // Determine props based on screen size
  const cardLayoutType = isTablet && !isDesktop ? "responsive" : "large-fixed";
  
  const injectedComponent = isDesktop && (recommendedUsers.length > 0 || isLoadingMembers) ? (
    <ListSubscribeLarge
      height="h-[380px]"
      users={recommendedUsers}
      isError={isErrorMembers}
      isLoading={isLoadingMembers}
      onSubscribeClick={onToggleFollow}
    />
  ) : undefined;

  // Combine responsive classes
  const gridClassName = "flex flex-col gap-5 items-center w-full t:flex-row t:flex-wrap t:justify-center d:grid d:grid-cols-4 d:justify-items-center";

  return (
    <BookStoryInfiniteList
      stories={stories}
      isLoading={isLoadingStories}
      isError={isErrorStories}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      onToggleLike={handleToggleLike}
      onToggleFollow={onToggleFollow}
      onProfileClick={(nickname) => router.push(`/profile/${nickname}`)}
      cardLayoutType={cardLayoutType}
      containerClassName="flex flex-col items-center w-full max-w-full gap-[20px]"
      gridClassName={gridClassName}
      injectedComponent={injectedComponent}
      injectedIndex={4}
      errorMessage="책 이야기 리스트를 불러오지 못했어요."
      emptyMessage="책 이야기 리스트가 없습니다."
    />
  );
};

export default HomeStoryList;

