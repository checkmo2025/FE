"use client";
import { useEffect, useState, useMemo } from "react";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";
import ListSubscribeLarge from "@/components/base-ui/home/list_subscribe_large";
import { useRouter } from "next/navigation";
import FloatingFab from "@/components/base-ui/Float";
import LoginModal from "@/components/base-ui/Login/LoginModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteStoriesQuery, useFollowingInfiniteStoriesQuery, useClubInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useRecommendedMembersQuery } from "@/hooks/queries/useMemberQueries";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";
import { useInView } from "react-intersection-observer";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import { toast } from "react-hot-toast";

export default function StoriesPage() {
  const router = useRouter();
  const { isLoggedIn, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthStore();
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
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCreateStory = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    router.push("/stories/new");
  };

  const handleCardClick = (id: number) => {
    router.push(`/stories/${id}`);
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

  const getCategoryClassName = (categoryId: string) => {
    return `text-center body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600 shrink-0 ${selectedCategory === categoryId ? "text-Gray-7 font-semibold" : "text-Gray-3"
      }`;
  };

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4">
      {isLoginModalOpen && (
        <LoginModal onClose={() => closeLoginModal()} />
      )}
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
                  subscribeText={story.authorInfo.following ? "구독중" : "구독"}
                  isFollowing={story.authorInfo.following}
                  onSubscribeClick={() => handleToggleFollow(story.authorInfo.nickname, story.authorInfo.following)}
                  hideSubscribeButton={story.writtenByMe}
                  onProfileClick={() => router.push(`/profile/${story.authorInfo.nickname}`)}
                  onClick={() => handleCardClick(story.bookStoryId)}
                  onLikeClick={() => handleToggleLike(story.bookStoryId)}
                />
              </div>
            ))}

            {/* 두 번째 줄: 추천 멤버가 있을 경우에만 추천 영역 표시 */}
            {recommendedMembers.length > 0 && (
              <ListSubscribeLarge
                height="h-[380px]"
                users={recommendedMembers}
                onSubscribeClick={(nickname, isFollowing) => handleToggleFollow(nickname, isFollowing)}
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
                  subscribeText={story.authorInfo.following ? "구독중" : "구독"}
                  isFollowing={story.authorInfo.following}
                  onSubscribeClick={() => handleToggleFollow(story.authorInfo.nickname, story.authorInfo.following)}
                  hideSubscribeButton={story.writtenByMe}
                  onProfileClick={() => router.push(`/profile/${story.authorInfo.nickname}`)}
                  onClick={() => handleCardClick(story.bookStoryId)}
                  onLikeClick={() => handleToggleLike(story.bookStoryId)}
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
          onClick={handleCreateStory}
        />
      </div>
    </div>
  );
}
