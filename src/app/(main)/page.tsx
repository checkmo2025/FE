"use client";

import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import NewsBannerSlider from "@/components/base-ui/home/NewsBannerSlider";
import HomeBookclub from "@/components/base-ui/home/home_bookclub";
import ListSubscribe from "@/components/base-ui/home/list_subscribe";

export default function HomePage() {
  const groups: { id: string; name: string }[] = [];
  return (
    <div className="mx-auto w-[1400px]">
      <div className="flex gap-6">
        <section className="w-[332px] pt-6">
          <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
            독서모임
          </h2>
          <HomeBookclub groups={groups} />
          <div className="pt-6">
            <ListSubscribe />
          </div>
        </section>
        <section className="flex-1 pt-6 ">
          <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">
            소식
          </h2>
          <NewsBannerSlider />

          {/* 책 이야기 card */}
          <div className="mt-6 grid grid-cols-3 gap-5">
            <BookStoryCard
              name="hy_0716"
              createdAt="2026.01.03"
              viewCount={302}
              title="나는 나이든 왕자다"
              content="나는 나이든 왕자다. 그 누가 숫자가 중요하다가 했던가. 세고 또 세는 그런 마법같은 경험을 한사람은 놀랍도록 이세상에 얼마 안된다! 나는 숲이 아닌 바다란걸..."
              likeCount={1}
              commentCount={1}
              buttonText={"구독"}
            />
            <BookStoryCard
              name="hy_0716"
              createdAt="2026.01.03"
              viewCount={302}
              title="나는 나이든 왕자다"
              content="나는 나이든 왕자다. 그 누가 숫자가 중요하다가 했던가. 세고 또 세는 그런 마법같은 경험을 한사람은 놀랍도록 이세상에 얼마 안된다! 나는 숲이 아닌 바다란걸..."
              likeCount={1}
              commentCount={1}
              buttonText={"구독"}
            />
            <BookStoryCard
              name="hy_0716"
              createdAt="2026.01.03"
              viewCount={302}
              title="나는 나이든 왕자다"
              content="나는 나이든 왕자다. 그 누가 숫자가 중요하다가 했던가. 세고 또 세는 그런 마법같은 경험을 한사람은 놀랍도록 이세상에 얼마 안된다! 나는 숲이 아닌 바다란걸..."
              likeCount={1}
              commentCount={1}
              buttonText={"구독"}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
