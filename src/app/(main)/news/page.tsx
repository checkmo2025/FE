"use client";

import Image from "next/image";
import NewsList from "@/components/base-ui/News/news_list";
import TodayRecommendedBooks from "@/components/base-ui/News/today_recommended_books";

const DUMMY_NEWS = [
  {
    id: 1,
    imageUrl: "/news_sample.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
  },
  {
    id: 2,
    imageUrl: "/news_sample.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
  },
  {
    id: 3,
    imageUrl: "/news_sample.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
  },
  {
    id: 4,
    imageUrl: "/news_sample.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
  },
];

const DUMMY_BOOKS = [
  {
    id: 1,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
  {
    id: 2,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
  {
    id: 3,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
  {
    id: 4,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
];

export default function NewsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4">
      <div className="flex justify-center items-center mt-7 mb-6">
        <div className="relative w-full h-[297px] t:h-[468px]" style={{ maxWidth: 'clamp(339px, 100%, 1040px)' }}>
          <Image
            src="/news_sample.svg"
            alt="소식 배너"
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 339px, (max-width: 1440px) 688px, 1040px"
            priority
          />
        </div>
      </div>

      {/* 뉴스 리스트 */}
      <div className="flex flex-col gap-4 items-center">
        {DUMMY_NEWS.map((news) => (
          <NewsList
            key={news.id}
            id={news.id}
            imageUrl={news.imageUrl}
            title={news.title}
            content={news.content}
            date={news.date}
          />
        ))}
      </div>

      <div className="w-screen -mx-4 my-8 border-b-4 border-Gray-1"></div>

      {/* 오늘의 추천 */}
      <TodayRecommendedBooks books={DUMMY_BOOKS} />

      {/* 문의하기 */}
      <button
        type="button"
        className="fixed bottom-[86px] right-6 t:bottom-8 t:right-8 z-[60] cursor-pointer hover:opacity-80 transition-opacity w-12 h-12 t:w-[88px] t:h-[88px]"
        aria-label="문의하기"
      >
        <Image
          src="/inquiry.svg"
          alt="문의하기"
          width={88}
          height={88}
          className="w-full h-full"
          priority
        />
      </button>
    </div>
  );
}