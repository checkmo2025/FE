"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import NewsBannerSlider from "@/components/base-ui/home/NewsBannerSlider";
import HomeBookclub from "@/components/base-ui/home/home_bookclub";
import ListSubscribeLarge from "@/components/base-ui/home/list_subscribe_large";
import ListSubscribeElement from "@/components/base-ui/home/list_subscribe_element";
import LoginModal from "@/components/base-ui/Login/LoginModal";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";

import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useInView } from "react-intersection-observer";
import { useRecommendedMembersQuery } from "@/hooks/queries/useMemberQueries";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthStore();

  const {
    data: storiesData,
    isLoading: isLoadingStories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isErrorStories,
  } = useInfiniteStoriesQuery();
  const { data: membersData, isLoading: isLoadingMembers, isError: isErrorMembers } = useRecommendedMembersQuery(isLoggedIn);
  const { data: myClubsData, isLoading: isLoadingClubs } = useMyClubsQuery(isLoggedIn);
  const { mutate: toggleLike } = useToggleStoryLikeMutation();
  const { mutate: toggleFollow } = useToggleFollowMutation();

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

  const groups = myClubsData?.clubList || [];

  const stories = storiesData?.pages.flatMap((page) => page.basicInfoList) || [];
  // 멤버 데이터가 없으면 빈 배열
  const recommendedUsers = membersData?.friends || [];

  // isLoading 멤버/클럽 변수는 로그인 되어있을 때만 실제 로딩 상태를 반영해야 함
  const isLoading = isLoadingStories || (isLoggedIn && isLoadingMembers) || (isLoggedIn && isLoadingClubs);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 t:px-6">
      {isLoginModalOpen && (
        <LoginModal onClose={() => closeLoginModal()} />
      )}

      {/* 모바일  */}
      <div className="flex flex-col gap-6 t:hidden">
        {/* 소식 */}
        <section className="pt-6">
          <h2 className="pb-4 body_1 leading-7 text-zinc-800">소식</h2>
          <NewsBannerSlider />
        </section>

        {/* 독서모임 + 사용자 추천 */}
        <section className="w-full">
          <div className="flex gap-4">
            <div className="flex-1">
              <h2 className="pb-2 body_1 leading-7 text-zinc-800">독서모임</h2>
              <HomeBookclub groups={groups} />
            </div>
            {/* 사용자 추천 */}
            <div className="flex-1">
              <h2 className="pb-2 body_1 leading-7 text-zinc-800">
                사용자 추천
              </h2>
              <div className="flex flex-col gap-3">
                {isErrorMembers && (
                  <div className="flex flex-1 items-center justify-center py-4">
                    <p className="text-Gray-4 text-[14px]">추천 목록을 불러오지 못했어요.</p>
                  </div>
                )}
                {!isErrorMembers && recommendedUsers.length === 0 && (
                  <div className="flex flex-1 items-center justify-center py-4">
                    <p className="text-Gray-4 text-[14px]">사용자 추천이 없습니다.</p>
                  </div>
                )}
                {!isErrorMembers && recommendedUsers.length > 0 &&
                  recommendedUsers.slice(0, 3).map((u) => (
                    <ListSubscribeElement
                      key={u.nickname}
                      name={u.nickname}
                      profileSrc={u.profileImageUrl}
                      isFollowing={u.isFollowing}
                      onSubscribeClick={() => handleToggleFollow(u.nickname, u.isFollowing)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* 책 이야기 카드 */}
        <section className="pt-6">
          <div className="flex flex-col gap-5 items-center">
            {isErrorStories ? (
              <div className="text-Gray-4 text-[14px]">책 이야기 리스트를 불러오지 못했어요.</div>
            ) : stories.length === 0 ? (
              <div className="text-Gray-4 text-[14px]">책 이야기 리스트가 없습니다.</div>
            ) : (
              stories.map((story) => (
                <BookStoryCardLarge
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
              ))
            )}
          </div>
        </section>
      </div>

      {/* 태블릿 */}
      <div className="hidden t:flex flex-col gap-6 d:hidden">
        {/* 소식 */}
        <section className="pt-6">
          <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
            소식
          </h2>
          <NewsBannerSlider />
        </section>

        {/* 독서모임 + 사용자 추천 */}
        <section className="w-full pt-6">
          <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
            독서모임
          </h2>
          <div className="flex gap-6 justify-center">
            <HomeBookclub groups={groups} />
            <ListSubscribeLarge
              height="h-[424px]"
              users={recommendedUsers}
              isError={isErrorMembers}
              onSubscribeClick={(nickname, isFollowing) => handleToggleFollow(nickname, isFollowing)}
            />
          </div>
        </section>

        {/* 책 이야기 카드 */}
        <section className="pt-6">
          <div className="flex flex-wrap gap-5 justify-center">
            {isErrorStories ? (
              <div className="text-Gray-4 text-[14px]">책 이야기 리스트를 불러오지 못했어요.</div>
            ) : stories.length === 0 ? (
              <div className="text-Gray-4 text-[14px]">책 이야기 리스트가 없습니다.</div>
            ) : (
              stories.map((story) => (
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
              ))
            )}
          </div>
        </section>
      </div>

      {/* 데스크톱 */}
      <div className="hidden d:flex flex-col gap-6 w-full">
        {/* 상단: 독서모임, 소식 */}
        <div className="flex flex-row gap-6 w-full pt-6">
          {/* 독서모임 (좌측, 너비 고정) */}
          <section className="w-[332px] shrink-0">
            <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
              독서모임
            </h2>
            <HomeBookclub groups={groups} />
          </section>

          {/* 소식 (우측, 남은 너비 전부) */}
          <section className="flex-1">
            <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
              소식
            </h2>
            <NewsBannerSlider />
          </section>
        </div>

        {/* 하단: 책 이야기 카드 영역 (전체 너비 4열 그리드) */}
        <section className="w-full pt-6">
          <div className="d:grid d:grid-cols-4 gap-5 d:justify-items-center">
            {isErrorStories ? (
              <div className="col-span-4 text-center text-Gray-4 text-[14px]">책 이야기 리스트를 불러오지 못했어요.</div>
            ) : stories.length === 0 ? (
              <div className="col-span-4 text-center text-Gray-4 text-[14px]">책 이야기 리스트가 없습니다.</div>
            ) : (
              <>
                {/* 1. 첫 4개 스토리 렌더링 */}
                {stories.slice(0, 4).map((story) => (
                  <div key={story.bookStoryId} className="shrink-0 w-full flex justify-center">
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
                      onSubscribeClick={() => handleToggleFollow(story.authorInfo.nickname, story.authorInfo.following)}
                      hideSubscribeButton={story.writtenByMe}
                      onProfileClick={() => router.push(`/profile/${story.authorInfo.nickname}`)}
                      onClick={() => router.push(`/stories/${story.bookStoryId}`)}
                      onLikeClick={() => handleToggleLike(story.bookStoryId)}
                    />
                  </div>
                ))}

                {/* 2. 두 번째 줄에 사용자 추천 (존재할 경우) */}
                {recommendedUsers.length > 0 && (
                  <ListSubscribeLarge
                    height="h-[380px]"
                    users={recommendedUsers}
                    isError={isErrorMembers}
                    onSubscribeClick={(nickname, isFollowing) => handleToggleFollow(nickname, isFollowing)}
                  />
                )}

                {/* 3. 나머지 스토리 렌더링 */}
                {stories.slice(4).map((story) => (
                  <div key={story.bookStoryId} className="shrink-0 w-full flex justify-center">
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
                      onSubscribeClick={() => handleToggleFollow(story.authorInfo.nickname, story.authorInfo.following)}
                      hideSubscribeButton={story.writtenByMe}
                      onProfileClick={() => router.push(`/profile/${story.authorInfo.nickname}`)}
                      onClick={() => router.push(`/stories/${story.bookStoryId}`)}
                      onLikeClick={() => handleToggleLike(story.bookStoryId)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </div>

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

      {/* 비로그인 시 플로팅 로그인 하기 버튼 */}
      {!isLoggedIn && (
        <button
          onClick={() => openLoginModal()}
          className="fixed bottom-21 right-4 t:bottom-8 t:right-8 z-[60] flex items-center justify-center w-auto h-[48px] px-6 bg-[#7B6154] text-white rounded-full shadow-lg hover:bg-[#5E4A40] transition-colors gap-2"
        >
          <Image
            src="/after_home.svg"
            alt=""
            width={20}
            height={20}
            className="brightness-0 invert"
          />
          <span className="font-semibold">로그인 하기</span>
        </button>
      )}
    </div>
  );
}
