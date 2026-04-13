"use client";
import { useState, useMemo } from "react";
import BookStoryInfiniteList from "@/components/base-ui/BookStory/Common/BookStoryInfiniteList";
import ListSubscribeLarge from "@/components/base-ui/home/Recommendation/list_subscribe_large";

import { useRouter } from "next/navigation";
import FloatingFab from "@/components/base-ui/Float";

import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteStoriesQuery, useFollowingInfiniteStoriesQuery, useClubInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useRecommendedMembersQuery } from "@/hooks/queries/useMemberQueries";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";

import CategorySlider from "@/components/base-ui/BookStory/Common/CategorySlider";

export default function StoriesPage() {
  const router = useRouter();
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const { mutate: toggleLike } = useToggleStoryLikeMutation();
  const { mutate: toggleFollow } = useToggleFollowMutation();
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const {
    data: defaultStoriesData,
    isLoading: isLoadingDefaultStories,
    isError: isErrorDefaultStories,
    fetchNextPage: fetchNextDefaultPage,
    hasNextPage: hasNextDefaultPage,
    isFetchingNextPage: isFetchingNextDefaultPage,
  } = useInfiniteStoriesQuery();

  const {
    data: followingStoriesData,
    isLoading: isLoadingFollowingStories,
    isError: isErrorFollowingStories,
    fetchNextPage: fetchNextFollowingPage,
    hasNextPage: hasNextFollowingPage,
    isFetchingNextPage: isFetchingNextFollowingPage,
  } = useFollowingInfiniteStoriesQuery(isLoggedIn);

  const isFollowingTab = selectedCategory === "following";
  const isClubTab = selectedCategory !== "all" && selectedCategory !== "following";
  const activeClubId = isClubTab ? Number(selectedCategory) : null;

  const {
    data: clubStoriesData,
    isLoading: isLoadingClubStories,
    isError: isErrorClubStories,
    fetchNextPage: fetchNextClubPage,
    hasNextPage: hasNextClubPage,
    isFetchingNextPage: isFetchingNextClubPage,
  } = useClubInfiniteStoriesQuery(activeClubId, isLoggedIn);

  const {
    storiesData,
    isLoadingStories,
    isErrorStories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMemo(() => {
    if (isFollowingTab) {
      return {
        storiesData: followingStoriesData,
        isLoadingStories: isLoadingFollowingStories,
        isErrorStories: isErrorFollowingStories,
        fetchNextPage: fetchNextFollowingPage,
        hasNextPage: hasNextFollowingPage,
        isFetchingNextPage: isFetchingNextFollowingPage,
      };
    }
    if (isClubTab) {
      return {
        storiesData: clubStoriesData,
        isLoadingStories: isLoadingClubStories,
        isErrorStories: isErrorClubStories,
        fetchNextPage: fetchNextClubPage,
        hasNextPage: hasNextClubPage,
        isFetchingNextPage: isFetchingNextClubPage,
      };
    }
    return {
      storiesData: defaultStoriesData,
      isLoadingStories: isLoadingDefaultStories,
      isErrorStories: isErrorDefaultStories,
      fetchNextPage: fetchNextDefaultPage,
      hasNextPage: hasNextDefaultPage,
      isFetchingNextPage: isFetchingNextDefaultPage,
    };
  }, [
    isFollowingTab,
    isClubTab,
    followingStoriesData,
    isLoadingFollowingStories,
    isErrorFollowingStories,
    fetchNextFollowingPage,
    hasNextFollowingPage,
    isFetchingNextFollowingPage,
    clubStoriesData,
    isLoadingClubStories,
    isErrorClubStories,
    fetchNextClubPage,
    hasNextClubPage,
    isFetchingNextClubPage,
    defaultStoriesData,
    isLoadingDefaultStories,
    isErrorDefaultStories,
    fetchNextDefaultPage,
    hasNextDefaultPage,
    isFetchingNextDefaultPage,
  ]);

  const { data: membersData, isLoading: isLoadingMembers } = useRecommendedMembersQuery(isLoggedIn);
  const { data: myClubsData, isLoading: isLoadingClubs } = useMyClubsQuery(isLoggedIn);

  const handleCreateStory = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    router.push("/stories/new");
  };

  const isLoading = isLoadingStories || (isLoggedIn && isLoadingMembers) || (isLoggedIn && isLoadingClubs);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
      </div>
    );
  }

  const allStories = storiesData?.pages.flatMap((page) => page.basicInfoList) || [];
  const recommendedMembers = membersData?.friends || [];

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-[100px]">
      <CategorySlider
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        myClubsData={myClubsData}
      />

      <BookStoryInfiniteList
        stories={allStories}
        isLoading={isLoadingStories}
        isError={isErrorStories}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        onToggleLike={handleToggleLike}
        onToggleFollow={handleToggleFollow}
        onProfileClick={(nickname) => router.push(`/profile/${nickname}`)}
        cardLayoutType="large-fixed"
        containerClassName="mt-6"
        gridClassName="flex flex-wrap gap-5 justify-center d:grid d:grid-cols-4 d:justify-items-center"
        injectedComponent={
          recommendedMembers.length > 0 && (
            <ListSubscribeLarge
              height="h-[380px]"
              users={recommendedMembers}
              onSubscribeClick={(nickname, isFollowing) => handleToggleFollow(nickname, isFollowing)}
            />
          )
        }
        injectedIndex={4}
      />

      {/* 글쓰기 버튼  */}
      <FloatingFab
        iconSrc="/icons_pencil.svg"
        iconAlt="글쓰기"
        onClick={handleCreateStory}
      />
    </div>
  );
}
