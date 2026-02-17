"use client";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";
import ListSubscribeLarge from "@/components/base-ui/home/list_subscribe_large";
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
      <div className="t:mt-3 h-[44px] d:h-[54px] flex gap-14 items-center border-b border-zinc-300 overflow-x-auto scrollbar-hide">
        <div className="text-center text-Gray-7 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600 shrink-0">
          전체
        </div>
        <div className="text-center text-Gray-3 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600 shrink-0">
          구독중
        </div>
        <div className="text-center text-Gray-3 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600 shrink-0">
          긁적긁적
        </div>
        <div className="text-center text-Gray-3 body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600 shrink-0">
          북적북적
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div>
        <div className="flex flex-wrap gap-5 mt-6 justify-center d:grid d:grid-cols-4 d:justify-items-center">
          {/* 첫 번째 줄 */}
          {DUMMY_STORIES.slice(0, 4).map((story) => (
            <div
              key={story.id}
              onClick={() => handleCardClick(story.id)}
              className="cursor-pointer shrink-0"
            >
              <BookStoryCardLarge
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
          {!isLoggedIn && <ListSubscribeLarge height="h-[380px]" />}
          {DUMMY_STORIES.slice(4, isLoggedIn ? 8 : 7).map((story) => (
            <div
              key={story.id}
              onClick={() => handleCardClick(story.id)}
              className="cursor-pointer shrink-0"
            >
              <BookStoryCardLarge
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
        <button
          type="button"
          className="fixed bottom-21 right-4 t:bottom-8 t:right-8 z-[60] cursor-pointer hover:opacity-80 transition-opacity w-18 h-18 t:w-22 t:h-22"
          onClick={() => router.push("/stories/new")}
        >
          <Image
            src="/add_story.svg"
            alt="글쓰기"
            width={88}
            height={88}
            className="w-full h-full"
          />
        </button>
      </div>
    </div>
  );
}
