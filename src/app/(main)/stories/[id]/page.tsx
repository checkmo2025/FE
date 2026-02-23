import BookstoryDetail from "@/components/base-ui/BookStory/bookstory_detail";
import StoryNavigation from "@/components/base-ui/BookStory/story_navigation";
import CommentSection from "@/components/base-ui/Comment/comment_section";
import Image from "next/image";
import { notFound } from "next/navigation";
import { storyService } from "@/services/storyService";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;

  // API 서버에서 스토리 데이터 가져오기
  const story = await storyService.getStoryById(Number(id));

  // 스토리가 없으면 404
  if (!story) {
    notFound();
  }

  const prevId = story.prevBookStoryId !== 0 ? story.prevBookStoryId : null;
  const nextId = story.nextBookStoryId !== 0 ? story.nextBookStoryId : null;

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
        <StoryNavigation currentId={story.bookStoryId} prevId={prevId} nextId={nextId}>
          <BookstoryDetail
            imageUrl={story.bookInfo.imgUrl || ""}
            authorName={story.authorInfo.nickname}
            authorNickname={story.authorInfo.nickname}
            authorId={story.authorInfo.nickname} // TODO: 실제 author ID로 변경 (현재 명세에 nickname만 있음)
            bookTitle={story.bookInfo.title}
            bookAuthor={story.bookInfo.author}
            bookDetail={story.description}
            createdAt={story.createdAt}
            viewCount={story.viewCount}
            likeCount={story.likes}
          />
        </StoryNavigation>
        {/* 책이야기 글 본문 */}
        <div className="t:border-t-2 border-Gray-1 w-full max-w-[1040px] px-5 t:mx-auto t:mt-10 pt-6">
          <h2 className="subhead_1 t:headline_3 text-Gray-7">{story.bookStoryTitle}</h2>
          <p className="body_1_3 t:subhead_4 text-Gray-5 mt-4 whitespace-pre-wrap">
            {story.description}
          </p>
        </div>
        {/* 댓글 */}
        <div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-5 mt-10 pt-6 pb-10">
          <CommentSection storyId={story.bookStoryId} />
        </div>
      </div>
    </div>
  );
}
