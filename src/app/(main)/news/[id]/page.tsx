"use client";

import FloatingFab from "@/components/base-ui/Float";
import TodayRecommendedBooks from "@/components/base-ui/News/today_recommended_books";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useNewsDetailQuery } from "@/hooks/queries/useNewsQueries";
import { useState, useEffect } from "react";

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

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { data: news, isLoading, isError } = useNewsDetailQuery(Number(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 5초 자동 슬라이드 로직
  useEffect(() => {
    if (!news || !news.imageUrls || news.imageUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % news.imageUrls.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news?.imageUrls?.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-pulse text-Gray-4 subhead_3">소식을 불러오는 중...</div>
      </div>
    );
  }

  if (isError || !news) {
    notFound();
    return null;
  }

  const imageUrls = news.imageUrls && news.imageUrls.length > 0 ? news.imageUrls : [news.thumbnailUrl || "/news_sample4.svg"];

  return (
    <>
      <div className="relative w-screen h-[297px] t:h-[468px] overflow-hidden">
        {imageUrls.map((url, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${idx === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={url}
              alt={`${news.title} - ${idx + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={idx === 0}
            />
          </div>
        ))}

        {/* Breadcrumb Overlay (Desktop) */}
        <div className="absolute top-0 left-0 right-0 hidden d:flex h-[44px] d:h-[64px] border-b border-zinc-300 z-20">
          <div className="px-4 t:px-6 d:px-3 h-full flex gap-5 items-center justify-start w-full ml-5.5 max-w-[1440px] mx-auto">
            <div className="d:subhead_4_1 text-Gray-3">전체</div>
            <div className="relative w-[12px] h-[12px] d:w-[18px] d:h-[18px]">
              <Image src="/triangle.svg" alt="next" fill className="object-contain" />
            </div>
            <div className="d:subhead_4_1 text-Gray-7">글 상세보기</div>
          </div>
        </div>

        {/* Indicator (Carousel Dots) */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {imageUrls.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto w-full max-w-[1400px] px-9 t:px-[200px] mt-6 t:mt-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h1 className="subhead_1 t:headline_3 text-Gray-7">{news.title}</h1>
          <p className="body_1_2 text-Gray-3">{news.publishStartAt}</p>
        </div>

        {/* 본문 */}
        <div className="w-full max-w-[1040px] mt-10 t:mt-22">
          <p className="body_1_3 t:subhead_3 text-Gray-6 whitespace-pre-wrap leading-relaxed">
            {news.content}
          </p>
        </div>

        {/* 원문 링크 버튼 */}
        {news.originalLink && (
          <div className="mt-12 flex justify-start">
            <a
              href={news.originalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-[8px] border border-Subbrown-4 text-Gray-7 subhead_4 hover:bg-Subbrown-1 transition-colors flex items-center gap-2"
            >
              원문 보러가기
              <Image src="/triangle.svg" alt="icon" width={12} height={12} className="rotate-0" />
            </a>
          </div>
        )}
      </div>

      <div className="w-screen -mx-4 my-8 border-b-4 border-Gray-1 mt-25"></div>

      <TodayRecommendedBooks books={DUMMY_BOOKS} className="mt-10" />

      <FloatingFab
        iconSrc="/icons_calling.svg"
        iconAlt="문의하기"
      />
    </>
  );
}
