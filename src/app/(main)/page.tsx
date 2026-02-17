"use client";

import { useState } from "react";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import NewsBannerSlider from "@/components/base-ui/home/NewsBannerSlider";
import HomeBookclub from "@/components/base-ui/home/home_bookclub";
import ListSubscribeLarge from "@/components/base-ui/home/list_subscribe_large";
import ListSubscribeElement from "@/components/base-ui/home/list_subscribe_element";
import LoginModal from "@/components/base-ui/Login/LoginModal";
import { DUMMY_STORIES } from "@/data/dummyStories";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";

import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const groups: { id: string; name: string }[] = [];
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthStore();

  // 사용자 더미 데이터
  const users = [
    { id: "1", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
    { id: "2", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
    { id: "3", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
    { id: "4", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
  ];
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
                {users.slice(0, 3).map((u) => (
                  <ListSubscribeElement
                    key={u.id}
                    name={u.name}
                    subscribingCount={u.subscribingCount}
                    subscribersCount={u.subscribersCount}
                    onSubscribeClick={() => console.log("subscribe", u.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 책 이야기 카드 */}
        <section className="pt-6">
          <div className="flex flex-col gap-5 items-center">
            {DUMMY_STORIES.slice(0, 3).map((story) => (
              <BookStoryCardLarge
                key={story.id}
                authorName={story.authorName}
                createdAt={story.createdAt}
                viewCount={story.viewCount}
                title={story.title}
                content={story.content}
                likeCount={story.likeCount}
                commentCount={story.commentCount}
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
            <ListSubscribeLarge height="h-[424px]" />
          </div>
        </section>

        {/* 책 이야기 카드 */}
        <section className="pt-6">
          <div className="flex flex-wrap gap-5 justify-center">
            {DUMMY_STORIES.slice(0, 4).map((story) => (
              <BookStoryCard
                key={story.id}
                authorName={story.authorName}
                createdAt={story.createdAt}
                viewCount={story.viewCount}
                title={story.title}
                content={story.content}
                likeCount={story.likeCount}
                commentCount={story.commentCount}
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
            <ListSubscribeLarge height="h-[380px]" />
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
              {DUMMY_STORIES.slice(0, 3).map((story) => (
                <BookStoryCard
                  key={story.id}
                  authorName={story.authorName}
                  createdAt={story.createdAt}
                  viewCount={story.viewCount}
                  title={story.title}
                  content={story.content}
                  likeCount={story.likeCount}
                  commentCount={story.commentCount}
                  subscribeText="구독"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
