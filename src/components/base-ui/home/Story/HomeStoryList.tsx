"use client";

import { BookStory } from "@/types/story";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";
import { useRouter } from "next/navigation";
import HomeRecommendationSection from "../Recommendation/HomeRecommendationSection";

interface HomeStoryListProps {
  deviceType: "mobile" | "tablet" | "desktop";
  stories: BookStory[];
  isError: boolean;
  handleToggleLike: (id: number) => void;
  handleToggleFollow: (nickname: string, isFollowing: boolean) => void;
  // Desktop 전용 Props
  recommendedUsers?: any[];
  isErrorMembers?: boolean;
}

export default function HomeStoryList({
  deviceType,
  stories,
  isError,
  handleToggleLike,
  handleToggleFollow,
  recommendedUsers,
  isErrorMembers,
}: HomeStoryListProps) {
  const router = useRouter();

  const renderStory = (story: BookStory, isLarge = true) => {
    const CardComponent = isLarge ? BookStoryCardLarge : BookStoryCard;
    return (
      <div key={story.bookStoryId} className="shrink-0 w-full flex justify-center">
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

  if (isError) {
    return (
      <div className={deviceType === "desktop" ? "col-span-4 text-center text-Gray-4 text-[14px] pt-6" : "text-Gray-4 text-[14px] pt-6 text-center"}>
        책 이야기 리스트를 불러오지 못했어요.
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className={deviceType === "desktop" ? "col-span-4 text-center text-Gray-4 text-[14px] pt-6" : "text-Gray-4 text-[14px] pt-6 text-center"}>
        책 이야기 리스트가 없습니다.
      </div>
    );
  }

  if (deviceType === "mobile") {
    return (
      <section className="pt-6">
        <div className="flex flex-col gap-5 items-center">
          {stories.map((s) => renderStory(s, true))}
        </div>
      </section>
    );
  }

  if (deviceType === "tablet") {
    return (
      <section className="pt-6">
        <div className="flex flex-wrap gap-5 justify-center">
          {stories.map((s) => renderStory(s, false))}
        </div>
      </section>
    );
  }

  // desktop
  return (
    <section className="w-full pt-6">
      <div className="d:grid d:grid-cols-4 gap-5 d:justify-items-center">
        {stories.slice(0, 4).map((s) => renderStory(s, true))}
        {recommendedUsers && recommendedUsers.length > 0 && (
          <HomeRecommendationSection
            deviceType="desktop"
            users={recommendedUsers}
            isError={!!isErrorMembers}
            onSubscribeClick={handleToggleFollow}
          />
        )}
        {stories.slice(4).map((s) => renderStory(s, true))}
      </div>
    </section>
  );
}
