"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import NewsBannerSlider from "@/components/base-ui/home/NewsBannerSlider";
import HomeBookclub from "@/components/base-ui/home/home_bookclub";
import ListSubscribeLarge from "@/components/base-ui/home/list_subscribe_large";
import ListSubscribeElement from "@/components/base-ui/home/list_subscribe_element";
import LoginModal from "@/components/base-ui/Login/LoginModal";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";

import { useAuthStore } from "@/store/useAuthStore";
import { memberService } from "@/services/memberService";
import { storyService } from "@/services/storyService";
import { RecommendedMember } from "@/types/member";
import { BookStory } from "@/types/story";
import { formatTimeAgo } from "@/utils/time";

export default function HomePage() {
  const groups: { id: string; name: string }[] = [];
  const { isLoggedIn, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthStore();

  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedMember[]>([]);
  const [stories, setStories] = useState<BookStory[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingStories, setIsLoadingStories] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (isLoggedIn) {
        setIsLoadingUsers(true);
        const recommendRes = await memberService.getRecommendedMembers();
        if (recommendRes && recommendRes.friends) {
          setRecommendedUsers(recommendRes.friends);
        }
        setIsLoadingUsers(false);
      }

      setIsLoadingStories(true);
      const storiesRes = await storyService.getAllStories();
      if (storiesRes && storiesRes.basicInfoList) {
        setStories(storiesRes.basicInfoList);
      }
      setIsLoadingStories(false);
    }
    fetchData();
  }, [isLoggedIn]);

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
            <div className="flex-1">
              <h2 className="pb-2 body_1 leading-7 text-zinc-800">
                사용자 추천
              </h2>
              <div className="flex flex-col gap-3">
                {recommendedUsers.slice(0, 3).map((u, idx) => (
                  <ListSubscribeElement
                    key={u.nickname + idx}
                    name={u.nickname}
                    profileSrc={u.profileImageUrl}
                    subscribingCount={0}
                    subscribersCount={0}
                    onSubscribeClick={() => console.log("subscribe", u.nickname)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 책 이야기 카드 */}
        <section className="pt-6">
          <div className="flex flex-col gap-5 items-center">
            {stories.slice(0, 3).map((story) => (
              <BookStoryCardLarge
                key={story.bookStoryId}
                authorName={story.authorInfo.nickname}
                createdAt={formatTimeAgo(new Date(story.createdAt))}
                viewCount={0}
                title={story.bookStoryTitle}
                content={story.description}
                likeCount={story.likes}
                commentCount={story.comments}
                subscribeText="구독"
              />
            ))}
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
            <ListSubscribeLarge height="h-[424px]" users={recommendedUsers} />
          </div>
        </section>

        {/* 책 이야기 카드 */}
        <section className="pt-6">
          <div className="flex flex-wrap gap-5 justify-center">
            {stories.slice(0, 4).map((story) => (
              <BookStoryCard
                key={story.bookStoryId}
                authorName={story.authorInfo.nickname}
                createdAt={formatTimeAgo(new Date(story.createdAt))}
                viewCount={0}
                title={story.bookStoryTitle}
                content={story.description}
                likeCount={story.likes}
                commentCount={story.comments}
                subscribeText="구독"
              />
            ))}
          </div>
        </section>
      </div>

      {/* 데스크톱 */}
      <div className="hidden d:flex flex-row gap-6 justify-center items-center">
        {/* 독서모임 + 사용자 추천 */}
        <section className="w-[332px] pt-6 shrink-0">
          <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
            독서모임
          </h2>
          <HomeBookclub groups={groups} />
          <div className="pt-6">
            <ListSubscribeLarge height="h-[380px]" users={recommendedUsers} />
          </div>
        </section>

        {/* 소식 + 책 이야기 */}
        <div className="flex-1 pt-6 flex flex-col gap-6">
          {/* 소식 */}
          <section>
            <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
              소식
            </h2>
            <NewsBannerSlider />
          </section>

          {/* 책 이야기 카드 */}
          <section>
            <div className="grid grid-cols-3 gap-5">
              {stories.slice(0, 3).map((story) => (
                <BookStoryCard
                  key={story.bookStoryId}
                  authorName={story.authorInfo.nickname}
                  createdAt={formatTimeAgo(new Date(story.createdAt))}
                  viewCount={0}
                  title={story.bookStoryTitle}
                  content={story.description}
                  likeCount={story.likes}
                  commentCount={story.comments}
                  subscribeText="구독"
                />
              ))}
            </div>
          </section>
        </div>
      </div>

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
