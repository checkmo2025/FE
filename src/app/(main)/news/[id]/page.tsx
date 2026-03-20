"use client";

import FloatingFab from "@/components/base-ui/Float";
import TodayRecommendedBooks from "@/components/base-ui/News/today_recommended_books";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useNewsDetailQuery } from "@/hooks/queries/useNewsQueries";
import { useRecommendedBooksQuery } from "@/hooks/queries/useBookQueries";
import { useState, useEffect, useMemo } from "react";

export default function NewsDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const newsId = typeof rawId === "string" ? parseInt(rawId, 10) : NaN;

  const {
    data: news,
    isLoading: isNewsLoading,
    isError: isNewsError,
  } = useNewsDetailQuery(newsId, { enabled: !isNaN(newsId) });
  const { data: recommendedData, isLoading: isBooksLoading } = useRecommendedBooksQuery();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 5초 자동 슬라이드 로직
  useEffect(() => {
    if (!news || !news.imageUrls || news.imageUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % news.imageUrls.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news?.imageUrls?.length]);

  const recommendedBooks = useMemo(() => {
    return (recommendedData?.detailInfoList || []).map((book) => ({
      id: book.isbn,
      imgUrl: book.imgUrl,
      title: book.title,
      author: book.author,
      likedByMe: book.likedByMe,
    }));
  }, [recommendedData]);

  if (isNewsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-pulse text-Gray-4 subhead_3">소식을 불러오는 중...</div>
      </div>
    );
  }

  if (isNewsError || !news) {
    notFound();
    return null;
  }

  const isValidSrc = (src: string) => {
    return (
      src &&
      src !== "string" &&
      (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://"))
    );
  };

  const rawImageUrls =
    news.imageUrls && news.imageUrls.length > 0
      ? news.imageUrls
      : [news.thumbnailUrl];

  // 유효한 URL만 필터링하고 없으면 기본 이미지 사용
  const filteredUrls = rawImageUrls.filter(isValidSrc);
  const imageUrls = filteredUrls.length > 0 ? filteredUrls : ["/news_sample4.svg"];

  return (
    <>
      {/* 상단 이미지 영역 - Option C: w-full 및 레이아웃 개선 */}
      <div className="relative w-full h-[297px] t:h-[468px] overflow-hidden bg-Gray-1 flex items-center justify-center">
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

        {/* Breadcrumb Overlay (Desktop) - 프리미엄 스타일 적용 */}
        <div className="absolute top-0 left-0 right-0 hidden d:flex h-[64px] border-b border-white/10 bg-gradient-to-b from-black/20 to-transparent z-20">
          <div className="px-6 h-full flex gap-4 items-center justify-start w-full max-w-[1040px] mx-auto">
            <div className="subhead_4_1 text-white/60">전체</div>
            <div className="relative w-[14px] h-[14px] opacity-60">
              <Image src="/triangle.svg" alt="next" fill className="object-contain brightness-0 invert" />
            </div>
            <div className="subhead_4_1 text-white font-medium">글 상세보기</div>
          </div>
        </div>

        {/* Indicator (Carousel Dots) */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {imageUrls.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`transition-all duration-300 ${idx === currentImageIndex
                  ? "w-8 h-2 rounded-[100px] bg-white shadow-sm"
                  : "w-2 h-2 rounded-full bg-white/40 hover:bg-white/60"
                  }`}
                aria-label={`이미지 ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto w-full max-w-[1040px] px-4 t:px-0 mt-8 t:mt-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4 border-b border-Gray-1 pb-6">
          <h1 className="subhead_1 t:headline_3 text-Gray-7 leading-tight">{news.title}</h1>
          <p className="body_1_2 text-Gray-3">{news.publishStartAt}</p>
        </div>

        {/* 본문 */}
        <div className="w-full mt-6 t:mt-10">
          <p className="body_1_3 t:subhead_3 text-Gray-6 whitespace-pre-wrap leading-[1.8] tracking-[-0.01em]">
            {news.content}
          </p>
        </div>

        {/* 원문 링크 버튼 */}
        {news.originalLink && isValidSrc(news.originalLink) && (
          <div className="mt-16 flex justify-start">
            <a
              href={news.originalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-[8px] border border-Subbrown-4 text-Gray-7 subhead_4 hover:bg-Subbrown-1 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
            >
              원문 보러가기
              <div className="relative w-3 h-3">
                <Image src="/triangle.svg" alt="icon" fill className="object-contain" />
              </div>
            </a>
          </div>
        )}
      </div>

      <div className="w-full border-b-4 border-Gray-1 mt-20"></div>

      {isBooksLoading ? (
        <div className="w-full flex justify-center py-24">
          <div className="animate-pulse text-Gray-3 subhead_4">추천 책을 불러오는 중...</div>
        </div>
      ) : (
        <TodayRecommendedBooks books={recommendedBooks} className="mt-12" />
      )}

      <FloatingFab
        iconSrc="/icons_calling.svg"
        iconAlt="문의하기"
      />
    </>
  );
}
