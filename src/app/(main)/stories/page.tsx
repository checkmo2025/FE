"use client";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";
import ListSubscribe from "@/components/base-ui/home/list_subscribe";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DUMMY_STORIES } from "@/data/dummyStories";

// TODO: 실제 로그인 상태 여부는 나중에
const isLoggedIn = false; // true: 로그인, false: 로그인X

export default function StoriesPage() {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/stories/${id}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4">
      <div className="t:mt-8 h-[44px] d:h-[54px] flex gap-14 items-center border-b border-zinc-300">
        <div className="text-center text-Gray-7 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600">
          전체
        </div>
        <div className="text-center text-Gray-3 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600">
          구독중
        </div>
        <div className="text-center text-Gray-3 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600">
          긁적긁적
        </div>
        <div className="text-center text-Gray-3 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600">
          북적북적
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div>
        <div className="grid grid-cols-1 t:grid-cols-2 d:grid-cols-4 gap-5 mt-6 justify-items-center">
          {/* 첫 번째 줄 */}
          {DUMMY_STORIES.slice(0, 4).map((story) => (
            <div
              key={story.id}
              onClick={() => handleCardClick(story.id)}
              className="cursor-pointer"
            >
              <BookStoryCard
                authorName={story.authorName}
                createdAt={story.createdAt}
                viewCount={story.viewCount}
                title={story.title}
                content={story.content}
                likeCount={story.likeCount}
                commentCount={story.commentCount}
                subscribeText="구독"
              />
            </div>
          ))}

          {/* 두 번째 줄: 비로그인 시 사용자 추천 + 카드 3개, 로그인 시 카드 4개 */}
          {!isLoggedIn && <ListSubscribe />}
          {DUMMY_STORIES.slice(4, isLoggedIn ? 8 : 7).map((story) => (
            <div
              key={story.id}
              onClick={() => handleCardClick(story.id)}
              className="cursor-pointer"
            >
              <BookStoryCard
                authorName={story.authorName}
                createdAt={story.createdAt}
                viewCount={story.viewCount}
                title={story.title}
                content={story.content}
                likeCount={story.likeCount}
                commentCount={story.commentCount}
                subscribeText="구독"
              />
            </div>
          ))}
        </div>

        {/* 글쓰기 버튼  */}
        <div className="fixed bottom-21 t:bottom-40 left-1/2 -translate-x-1/2 w-full max-w-[1400px] px-4 pointer-events-none">
          <button
            type="button"
            className="absolute bottom-0 right-4 cursor-pointer pointer-events-auto"
            onClick={() => router.push("/stories/new")}
          >
            <Image src="/add_story.svg" alt="글쓰기" width={72} height={72} />
          </button>
        </div>
      </div>
    </div>
  );
}
