"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInfiniteNewsQuery } from "@/hooks/queries/useNewsQueries";

export default function NewsBannerSlider() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const { data, isLoading, isError } = useInfiniteNewsQuery();

  const newsList = data?.pages.flatMap((page) => page.basicInfoList) || [];

  // 5초 자동 슬라이드 로직
  useEffect(() => {
    const slideCount = Math.min(newsList.length, 5);
    if (slideCount <= 1) return;

    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slideCount);
    }, 5000);

    return () => clearInterval(timer);
  }, [newsList.length]);

  if (isLoading) {
    return (
      <div className="relative h-[297px] t:h-[424px] w-full overflow-hidden rounded-[10px] bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">소식을 불러오는 중...</div>
      </div>
    );
  }

  if (isError || newsList.length === 0) {
    return (
      <div className="relative h-[297px] t:h-[424px] w-full overflow-hidden rounded-[10px] bg-gray-50 flex flex-col items-center justify-center gap-2">
        <div className="text-gray-400 text-lg font-medium">새로운 소식이 아직 없어요!</div>
        <div className="text-gray-400 text-sm">준비 중인 소식을 기다려 주세요.</div>
      </div>
    );
  }
  const isValidSrc = (src: string) => {
    return src && src !== "string" && (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://"));
  };
  // Dot navigation only shows max 5
  const slideCount = Math.min(newsList.length, 5);
  const safeIndex = index % slideCount;

  return (
    <div className="relative h-[297px] t:h-[424px] w-full overflow-hidden rounded-[10px]">
      {newsList.slice(0, slideCount).map((news, i) => {
        const imageSrc = isValidSrc(news.thumbnailUrl) ? news.thumbnailUrl : "/news_sample.svg";
        const isActive = i === safeIndex;

        return (
          <div
            key={news.newsId}
            className={`absolute inset-0 w-full h-full cursor-pointer group transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            onClick={() => router.push(`/news/${news.newsId}`)}
          >
            <Image
              src={imageSrc}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={i === 0}
            />

            {/* Text Overlay */}
            <div className="absolute inset-y-0 right-0 w-1/2 p-6 t:p-10 flex flex-col justify-center items-end bg-gradient-to-l from-black/90 via-black/50 to-transparent text-right">
              <div className="flex flex-col gap-2 t:gap-3 text-white">
                <h3 className="text-2xl t:text-4xl font-bold leading-tight drop-shadow-md">
                  {news.title}
                </h3>
                <p className="text-sm t:text-lg text-white/90 line-clamp-4 max-w-[280px] t:max-w-[400px] whitespace-pre-line drop-shadow-sm">
                  {news.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute top-[27px] left-[33px] flex gap-2 z-20">
        {newsList.slice(0, slideCount).map((_, i) => {
          const active = i === safeIndex;

          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`배너 ${i + 1}`}
              className={[
                "transition-all duration-300",
                active
                  ? "w-6.5 h-2.5 rounded-[100px] bg-primary-1"
                  : "w-2.5 h-2.5 rounded-full bg-Subbrown-2",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
