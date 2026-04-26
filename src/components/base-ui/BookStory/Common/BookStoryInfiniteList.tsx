"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookStoryCard from "@/components/base-ui/BookStory/Common/bookstory_card";
import EmptyState from "@/components/common/EmptyState";
import { BookStory } from "@/types/story";
import { useInView } from "react-intersection-observer";

interface BookStoryInfiniteListProps {
  stories: BookStory[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onToggleLike: (id: number) => void;
  onToggleFollow?: (nickname: string, isFollowing: boolean) => void;
  onProfileClick?: (nickname: string) => void;
  hideSubscribeButton?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  cardLayoutType?: "responsive" | "large-fixed";
  // 특정 인덱스 뒤에 컴포넌트를 주입하기 위한 프롭
  injectedComponent?: React.ReactNode;
  injectedIndex?: number;
  containerClassName?: string;
  gridClassName?: string;
}

const BookStoryInfiniteList: React.FC<BookStoryInfiniteListProps> = ({
  stories,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onToggleLike,
  onToggleFollow,
  onProfileClick,
  hideSubscribeButton = false,
  emptyMessage = "작성된 책 이야기가 없습니다.",
  errorMessage = "책 이야기를 불러오는 중 오류가 발생했습니다.",
  cardLayoutType = "responsive",
  injectedComponent,
  injectedIndex = 4,
  containerClassName = "flex flex-col items-center w-full max-w-[342px] min-[540px]:max-w-[523px] md:max-w-[684px] lg:max-w-[1048px] mx-auto gap-[20px]",
  gridClassName = "grid grid-cols-2 min-[540px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[12px] lg:gap-[20px] w-full",
}) => {
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && stories.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 w-full min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-3"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-20 text-Gray-5 body_1 w-full min-h-[200px]">
        {errorMessage}
      </div>
    );
  }

  if (stories.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const renderCard = (story: BookStory) => (
    <BookStoryCard
      key={story.bookStoryId}
      layoutType={cardLayoutType}
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
      onSubscribeClick={() => onToggleFollow?.(story.authorInfo.nickname, story.authorInfo.following)}
      hideSubscribeButton={hideSubscribeButton || story.writtenByMe}
      onProfileClick={() => onProfileClick?.(story.authorInfo.nickname)}

      onClick={() => router.push(`/stories/${story.bookStoryId}`)}
      onLikeClick={(e) => {
        e.stopPropagation();
        onToggleLike(story.bookStoryId);
      }}
    />
  );

  return (
    <div className={containerClassName}>
      <div className={gridClassName}>
        {injectedComponent ? (
          <>
            {stories.slice(0, injectedIndex).map(renderCard)}
            {injectedComponent}
            {stories.slice(injectedIndex).map(renderCard)}
          </>
        ) : (
          stories.map(renderCard)
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={ref} className="w-full flex justify-center py-10">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-3"></div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookStoryInfiniteList;
