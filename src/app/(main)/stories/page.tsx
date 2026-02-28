"use client";
import { useEffect, useState } from "react";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";
import ListSubscribeLarge from "@/components/base-ui/home/list_subscribe_large";
import { useRouter } from "next/navigation";
import FloatingFab from "@/components/base-ui/Float";
import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteStoriesQuery, useFollowingInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useRecommendedMembersQuery } from "@/hooks/queries/useMemberQueries";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";
import { useInView } from "react-intersection-observer";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";

export default function StoriesPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { mutate: toggleLike } = useToggleStoryLikeMutation();
  const { mutate: toggleFollow } = useToggleFollowMutation();
  const [selectedCategory, setSelectedCategory] = useState("all");

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
  } = useFollowingInfiniteStoriesQuery();

  const isFollowingTab = selectedCategory === "following";

  const storiesData = isFollowingTab ? followingStoriesData : defaultStoriesData;
  const isLoadingStories = isFollowingTab ? isLoadingFollowingStories : isLoadingDefaultStories;
  const isErrorStories = isFollowingTab ? isErrorFollowingStories : isErrorDefaultStories;
  const fetchNextPage = isFollowingTab ? fetchNextFollowingPage : fetchNextDefaultPage;
  const hasNextPage = isFollowingTab ? hasNextFollowingPage : hasNextDefaultPage;
  const isFetchingNextPage = isFollowingTab ? isFetchingNextFollowingPage : isFetchingNextDefaultPage;

  const { data: membersData, isLoading: isLoadingMembers } = useRecommendedMembersQuery(isLoggedIn);
  const { data: myClubsData, isLoading: isLoadingClubs } = useMyClubsQuery();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCardClick = (id: number) => {
    router.push(`/stories/${id}`);
  };

  const isLoading = isLoadingStories || (isLoggedIn && isLoadingMembers) || isLoadingClubs;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
      </div>
    );
  }

  const allStories = storiesData?.pages.flatMap((page) => page.basicInfoList) || [];
  const recommendedMembers = membersData?.friends || [];

  const getCategoryClassName = (categoryId: string) => {
    return `text-center body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600 shrink-0 ${selectedCategory === categoryId ? "text-Gray-7 font-semibold" : "text-Gray-3"
      }`;
  };

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4">
      <div className="t:mt-3 h-[44px] d:h-[54px] flex gap-14 items-center border-b border-zinc-300 overflow-x-auto scrollbar-hide">
        <div
          onClick={() => setSelectedCategory("all")}
          className={getCategoryClassName("all")}
        >
          전체
        </div>
        <div
          onClick={() => setSelectedCategory("following")}
          className={getCategoryClassName("following")}
        >
          구독중
        </div>
        {myClubsData?.clubList.map((club) => (
          <div
            key={club.clubId}
            onClick={() => setSelectedCategory(club.clubId.toString())}
            className={getCategoryClassName(club.clubId.toString())}
          >
            {club.clubName}
          </div>
        ))}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div>
        {isErrorStories ? (
          <div className="flex w-full min-h-[400px] justify-center items-center text-Gray-4 body_1_2">
            책 이야기 리스트를 불러오지 못했어요.
          </div>
        ) : allStories.length === 0 && !isLoading ? (
          <div className="flex w-full min-h-[400px] justify-center items-center text-Gray-4 body_1_2">
            책 이야기 리스트가 없습니다.
          </div>
        ) : (
          <div className="flex flex-wrap gap-5 mt-6 justify-center d:grid d:grid-cols-4 d:justify-items-center">
            {/* 첫 번째 줄 (처음 4개) */}
            {allStories.slice(0, 4).map((story) => (
              <div
                key={story.bookStoryId}
                className="shrink-0"
              >
                <BookStoryCardLarge
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
                  onSubscribeClick={() => toggleFollow({ nickname: story.authorInfo.nickname, isFollowing: story.authorInfo.following })}
                  hideSubscribeButton={story.writtenByMe}
                  onProfileClick={() => router.push(`/profile/${story.authorInfo.nickname}`)}
                  onClick={() => handleCardClick(story.bookStoryId)}
                  onLikeClick={() => toggleLike(story.bookStoryId)}
                />
              </div>
            ))}

            {/* 두 번째 줄: 추천 멤버가 있을 경우에만 추천 영역 표시 */}
            {recommendedMembers.length > 0 && (
              <ListSubscribeLarge
                height="h-[380px]"
                users={recommendedMembers}
                onSubscribeClick={(nickname, isFollowing) => toggleFollow({ nickname, isFollowing })}
              />
            )}

            {/* 나머지 카드들 */}
            {allStories.slice(4).map((story) => (
              <div
                key={story.bookStoryId}
                className="shrink-0"
              >
                <BookStoryCardLarge
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
                  onSubscribeClick={() => toggleFollow({ nickname: story.authorInfo.nickname, isFollowing: story.authorInfo.following })}
                  hideSubscribeButton={story.writtenByMe}
                  onProfileClick={() => router.push(`/profile/${story.authorInfo.nickname}`)}
                  onClick={() => handleCardClick(story.bookStoryId)}
                  onLikeClick={() => toggleLike(story.bookStoryId)}
                />
              </div>
            ))}
          </div>

        )}

        {/* 무한 스크롤 옵저버 타겟 */}
        {!isErrorStories && hasNextPage && (
          <div ref={ref} className="w-full flex justify-center py-10">
            {isFetchingNextPage ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
            ) : (
              <div className="h-8"></div>
            )}
          </div>
        )}
        {/* 글쓰기 버튼  */}
        <FloatingFab
          iconSrc="/icons_pencil.svg"
          iconAlt="글쓰기"
          onClick={() => router.push("/stories/new")}
        />
      </div>
    </div>
  );
}
