"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchBookResult from "@/components/base-ui/Search/search_bookresult";
import { DUMMY_STORIES } from "@/data/dummyStories";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = Number(params.id);
  const [liked, setLiked] = useState(false);

  // 더미 데이터
  const bookData = {
    id: 1,
    imgUrl: "/booksample.svg",
    title: "어린 왕자",
    author: "김개미, 연수",
    detail: "최대 500(넘어가면...으로)",
  };

  // 관련된 책 이야기들 (더미 데이터에서 필터링)
  const relatedStories = DUMMY_STORIES.filter(
    (story) => story.bookTitle === bookData.title,
  );

  return (
    <div className="mx-auto px-4 py-6 t:px-6 t:py-8">
      <div className="max-w-[1043px] mx-auto">
        <p className="text-Gray-7 body_1 t:subhead_1 mb-5">
          도서 선택 <span className="text-primary-2">{bookData.title}</span> 중
        </p>

        {/* 선택한 책 카드 */}
        <div className="mb-14">
          <SearchBookResult
            imgUrl={bookData.imgUrl}
            title={bookData.title}
            author={bookData.author}
            detail={bookData.detail}
            liked={liked}
            onLikeChange={setLiked}
            onPencilClick={() => {
              router.push(`/stories/new?bookId=${bookId}`);
            }}
          />
        </div>

        {/* 책이야기 */}
        <div className="mb-5">
          <h2 className="text-Gray-7 body_1 t:subhead_1">
            책이야기{" "}
            <span className="text-primary-2">{relatedStories.length}</span>
          </h2>
        </div>

        {/* 책 이야기 카드 */}
        <div className="grid grid-cols-1 t:grid-cols-2 d:grid-cols-3 gap-5 justify-items-center">
          {relatedStories.map((story) => (
            <div
              key={story.id}
              onClick={() => router.push(`/stories/${story.id}`)}
              className="cursor-pointer"
            >
              <BookStoryCardLarge
                authorName={story.authorName}
                createdAt={story.createdAt}
                viewCount={story.viewCount}
                coverImgSrc={story.bookImageUrl}
                title={story.title}
                content={story.content}
                likeCount={story.likeCount}
                commentCount={story.commentCount}
                subscribeText="구독"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
