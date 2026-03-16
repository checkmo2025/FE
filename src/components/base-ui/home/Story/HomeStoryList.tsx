"use client";

import React from "react";
import BookStoryInfiniteList from "@/components/base-ui/BookStory/Common/BookStoryInfiniteList";
import ListSubscribeLarge from "@/components/base-ui/home/Subscription/list_subscribe_large";
import { useInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { RecommendedMember } from "@/types/member";

interface HomeStoryListProps {
  recommendedUsers: RecommendedMember[];
  isErrorMembers: boolean;
  onToggleFollow: (nickname: string, isFollowing: boolean) => void;
}

const HomeStoryList: React.FC<HomeStoryListProps> = ({
  recommendedUsers,
  isErrorMembers,
  onToggleFollow,
}) => {
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const router = useRouter();

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

  return (
    <>
      {/* 모바일: 1열 리스트 */}
      <div className="t:hidden flex flex-col gap-5 items-center w-full">
        <BookStoryInfiniteList
          stories={stories}
          isLoading={isLoadingStories}
          isError={isErrorStories}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          onToggleLike={handleToggleLike}
          onToggleFollow={onToggleFollow}
          cardLayoutType="large-fixed"
          gridClassName="flex flex-col gap-5 items-center w-full"
          errorMessage="책 이야기 리스트를 불러오지 못했어요."
          emptyMessage="책 이야기 리스트가 없습니다."
        />
      </div>

      {/* 태블릿: 2열/3열 리스트 */}
      <div className="hidden t:flex d:hidden w-full">
        <BookStoryInfiniteList
          stories={stories}
          isLoading={isLoadingStories}
          isError={isErrorStories}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          onToggleLike={handleToggleLike}
          onToggleFollow={onToggleFollow}
          cardLayoutType="responsive"
          gridClassName="flex flex-wrap gap-5 justify-center"
          errorMessage="책 이야기 리스트를 불러오지 못했어요."
          emptyMessage="책 이야기 리스트가 없습니다."
        />
      </div>

      {/* 데스크톱: 추천 섹션 포함 그리드 */}
      <div className="hidden d:flex w-full">
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
          cardLayoutType="large-fixed"
          containerClassName="flex flex-col items-center w-full max-w-full gap-[20px]"
          gridClassName="d:grid d:grid-cols-4 gap-5 d:justify-items-center w-full"
          injectedComponent={
            recommendedUsers.length > 0 && (
              <ListSubscribeLarge
                height="h-[380px]"
                users={recommendedUsers}
                isError={isErrorMembers}
                onSubscribeClick={onToggleFollow}
              />
            )
          }
          injectedIndex={4}
          errorMessage="책 이야기 리스트를 불러오지 못했어요."
          emptyMessage="책 이야기 리스트가 없습니다."
        />
      </div>
    </>
  );
};

export default HomeStoryList;
