"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import { useOtherMemberInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useInView } from "react-intersection-observer";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import { useAuthStore } from "@/store/useAuthStore";

export default function BookStoryList({ nickname }: { nickname: string }) {
  const router = useRouter();
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

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 w-full min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-10 text-Gray-5 body_1 w-full min-h-[200px]">
        책 이야기를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const stories = data?.pages.flatMap((page) => page.basicInfoList) || [];

  if (stories.length === 0) {
    return (
      <div className="flex justify-center flex-col items-center py-20 text-Gray-4 body_1 w-full min-h-[200px] border border-Subbrown-4 rounded-[12px] bg-white gap-2">
        <span>작성된 책 이야기가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[1048px] mx-auto gap-[20px] px-[18px] md:px-[40px] lg:px-0">
      <div className="grid grid-cols-2 min-[540px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[12px] lg:gap-[20px] w-fit">
        {stories.map((story) => (
          <BookStoryCard
            key={story.bookStoryId}
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
            subscribeText={story.authorInfo.following ? "구독 중" : "구독"}
            isFollowing={story.authorInfo.following}
            onSubscribeClick={() => handleToggleFollow(story.authorInfo.nickname, story.authorInfo.following)}
            hideSubscribeButton={story.writtenByMe}
            onClick={() => router.push(`/stories/${story.bookStoryId}`)}
            onLikeClick={() => handleToggleLike(story.bookStoryId)}
          />
        ))}
      </div>

      {/* 무한 스크롤 타겟 */}
      {hasNextPage && (
        <div ref={ref} className="w-full flex justify-center py-10">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      )}
    </div>
  );
}
