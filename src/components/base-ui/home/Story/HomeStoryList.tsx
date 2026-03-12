"use client";

import { BookStory } from "@/types/story";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";
import { useRouter } from "next/navigation";
import HomeRecommendationSection from "../Recommendation/HomeRecommendationSection";
import React from "react";
import { HomeStoryListSkeleton } from "../shared/HomeSkeleton";

interface HomeStoryListProps {
  stories: BookStory[];
  isError: boolean;
  isLoading?: boolean;
  handleToggleLike: (id: number) => void;
  handleToggleFollow: (nickname: string, isFollowing: boolean) => void;
  // Desktop 전용 추천 섹션 Props
  recommendedUsers?: any[];
  isErrorMembers?: boolean;
  isLoadingMembers?: boolean;
  // 무한 스크롤 관련 Props
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  observerRef: (node?: Element | null | undefined) => void;
}

export default function HomeStoryList({
  stories,
  isError,
  isLoading,
  handleToggleLike,
  handleToggleFollow,
  recommendedUsers,
  isErrorMembers,
  isLoadingMembers,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  observerRef,
}: HomeStoryListProps) {
  const router = useRouter();

  if (isLoading && stories.length === 0) {
    return <HomeStoryListSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full text-center text-Gray-4 text-[14px] pt-6">
        책 이야기 리스트를 불러오지 못했어요.
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="w-full text-center text-Gray-4 text-[14px] pt-6">
        책 이야기 리스트가 없습니다.
      </div>
    );
  }

  // 카드 렌더링 헬퍼 (통합 버전)
  const renderStoryCard = (story: BookStory, isLarge: boolean, deviceClass: string) => {
    const CardComponent = isLarge ? BookStoryCardLarge : BookStoryCard;
    return (
      <div key={`${story.bookStoryId}-${isLarge}`} className={`shrink-0 w-full flex justify-center ${deviceClass}`}>
        <CardComponent
          id={story.bookStoryId}
          authorName={story.authorInfo.nickname}
          profileImgSrc={story.authorInfo.profileImageUrl}
          createdAt={story.createdAt}
          viewCount={story.viewCount}
          title={story.bookStoryTitle}
          content={story.description}
          likeCount={story.likes}
          commentCount={story.commentCount}
          likedByMe={story.likedByMe}
          coverImgSrc={story.bookInfo.imgUrl}
          subscribeText={story.authorInfo.following ? "구독중" : "구독"}
          isFollowing={story.authorInfo.following}
          onSubscribeClick={() => handleToggleFollow(story.authorInfo.nickname, story.authorInfo.following)}
          hideSubscribeButton={story.writtenByMe}
          {...(isLarge && { onProfileClick: () => router.push(`/profile/${story.authorInfo.nickname}`) })}
          onClick={() => router.push(`/stories/${story.bookStoryId}`)}
          onLikeClick={() => handleToggleLike(story.bookStoryId)}
        />
      </div>
    );
  };

  const containerClasses = "pt-6 flex flex-col gap-5 items-center t:flex-row t:flex-wrap t:justify-center d:grid d:grid-cols-4 d:justify-items-center w-full";

  return (
    <>
      <section className={containerClasses}>
        {stories.map((story, index) => (
          <React.Fragment key={story.bookStoryId}>
            {/* 데스크톱 전용: 4번째 스토리 이후 추천 섹션 삽입 */}
            {index === 4 && (recommendedUsers || isLoadingMembers) && (
              <div className="hidden d:block w-full">
                <HomeRecommendationSection
                  users={recommendedUsers || []}
                  isError={!!isErrorMembers}
                  isLoading={isLoadingMembers}
                  onSubscribeClick={handleToggleFollow}
                />
              </div>
            )}

            {/* 모바일: Large Card */}
            {renderStoryCard(story, true, "t:hidden")}

            {/* 태블릿: Small Card */}
            {renderStoryCard(story, false, "hidden t:flex d:hidden")}

            {/* 데스크톱: Large Card */}
            {renderStoryCard(story, true, "hidden d:flex")}
          </React.Fragment>
        ))}
      </section>

      {/* 무한 스크롤 트리거 영역 */}
      {!isError && hasNextPage && (
        <div ref={observerRef} className="w-full flex justify-center py-10">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      )}
    </>
  );
}
