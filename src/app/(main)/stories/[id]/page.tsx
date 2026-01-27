import BookstoryDetail from "@/components/base-ui/BookStory/bookstory_detail";
import StoryNavigation from "@/components/base-ui/BookStory/story_navigation";
import CommentSection from "@/components/base-ui/Comment/comment_section";
import Image from "next/image";
import { getStoryById, getAdjacentStoryIds } from "@/data/dummyStories";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;

  // id로 스토리 데이터 가져오기
  const story = getStoryById(Number(id));

  // 스토리가 없으면 404
  if (!story) {
    notFound();
  }

  // 이전/다음 스토리 ID
  const { prevId, nextId } = getAdjacentStoryIds(Number(id));

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4">
      {/* 책이야기 > 상세보기 */}
      {/* 모바일: 전체 너비 선 */}
      <div className="t:hidden w-screen -mx-4 border-b border-zinc-300">
        <div className="px-4 h-[44px] flex gap-5 items-center">
          <div className="body_1 text-Gray-3">책이야기</div>
          <div className="relative w-[12px] h-[12px]">
            <Image
              src="/triangle.svg"
              alt="next"
              fill
              className="object-contain"
            />
          </div>
          <div className="body_1 text-Gray-7">상세보기</div>
        </div>
      </div>
      {/* 태블릿/데스크탑: max-w 안에서 선 */}
      <div className="hidden t:flex t:mt-6 h-[44px] gap-5 items-center border-b border-zinc-300">
        <div className="d:subhead_4_1 text-Gray-3">책이야기</div>
        <div className="relative w-[12px] h-[12px] d:w-[18px] d:h-[18px]">
          <Image
            src="/triangle.svg"
            alt="next"
            fill
            className="object-contain"
          />
        </div>
        <div className="d:subhead_4_1 text-Gray-7">상세보기</div>
      </div>
      {/* 메인 콘텐츠 영역 */}
      <div>
        <StoryNavigation currentId={story.id} prevId={prevId} nextId={nextId}>
          <BookstoryDetail
            imageUrl={story.bookImageUrl}
            authorName={story.authorName}
            authorNickname={story.authorNickname}
            authorId={story.id}
            bookTitle={story.bookTitle}
            bookAuthor={story.bookAuthor}
            bookDetail={story.bookDetail}
            createdAt={story.createdAt}
            viewCount={story.viewCount}
            likeCount={story.likeCount}
          />
        </StoryNavigation>
        {/* 책이야기 글 본문 */}
        <div className="t:border-t-2 border-Gray-1 w-full max-w-[1040px] px-5 t:mx-auto t:mt-10 pt-6">
          <h2 className="subhead_1 t:headline_3 text-Gray-7">{story.title}</h2>
          <p className="body_1_3 t:subhead_4 text-Gray-5 mt-4 whitespace-pre-wrap">
            {story.content}
          </p>
        </div>
        {/* 댓글 */}
        <div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-5 mt-10 pt-6 pb-10">
          <CommentSection storyId={story.id} />
        </div>
      </div>
    </div>
  );
}
