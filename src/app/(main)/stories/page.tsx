"use client";
import { useEffect, useState } from "react";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";
import ListSubscribeLarge from "@/components/base-ui/home/list_subscribe_large";
import { useRouter } from "next/navigation";
import FloatingFab from "@/components/base-ui/Float";
import { useAuthStore } from "@/store/useAuthStore";
import { storyService } from "@/services/storyService";
import { memberService } from "@/services/memberService";
import { BookStory } from "@/types/story";
import { RecommendedMember } from "@/types/member";

export default function StoriesPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [stories, setStories] = useState<BookStory[]>([]);
  const [recommendedMembers, setRecommendedMembers] = useState<
    RecommendedMember[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [storiesData, membersData] = await Promise.all([
          storyService.getAllStories(),
          isLoggedIn ? memberService.getRecommendedMembers() : Promise.resolve(undefined),
        ]);

        if (storiesData) {
          setStories(storiesData.basicInfoList);
        }
        if (membersData) {
          setRecommendedMembers(membersData.friends);
        }
      } catch (error) {
        console.error("Error fetching stories page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const handleCardClick = (id: number) => {
    router.push(`/stories/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
      </div>
    );
  }

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
          {/* 첫 번째 줄 (처음 4개) */}
          {stories.slice(0, 4).map((story) => (
            <div
              key={story.bookStoryId}
              onClick={() => handleCardClick(story.bookStoryId)}
              className="cursor-pointer shrink-0"
            >
              <BookStoryCardLarge
                authorName={story.authorInfo.nickname}
                createdAt={story.createdAt}
                viewCount={0} // API에 viewCount가 없는 경우 0으로 처리하거나 다른 필드 사용
                title={story.bookStoryTitle}
                content={story.description}
                likeCount={story.likes}
                commentCount={0} // API에 commentCount가 없는 경우 고려
                subscribeText={story.authorInfo.following ? "구독중" : "구독"}
              />
            </div>
          ))}

          {/* 두 번째 줄: 비로그인 시 추천 영역 표시 (디자인에 따라 다를 수 있음) */}
          {/* 유저 요청: "UI를 보면 중간에 추천 친구 해주는 것도 있어." */}
          <ListSubscribeLarge
            height="h-[380px]"
            users={recommendedMembers}
          />

          {/* 나머지 카드들 */}
          {stories.slice(4).map((story) => (
            <div
              key={story.bookStoryId}
              onClick={() => handleCardClick(story.bookStoryId)}
              className="cursor-pointer shrink-0"
            >
              <BookStoryCardLarge
                authorName={story.authorInfo.nickname}
                createdAt={story.createdAt}
                viewCount={0}
                title={story.bookStoryTitle}
                content={story.description}
                likeCount={story.likes}
                commentCount={0}
                subscribeText={story.authorInfo.following ? "구독중" : "구독"}
              />
            </div>
          ))}
        </div>
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
