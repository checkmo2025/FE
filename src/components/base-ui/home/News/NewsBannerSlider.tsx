"use client";

import { useInfiniteNewsQuery } from "@/hooks/queries/useNewsQueries";
import SwipeCarousel from "@/components/common/SwipeCarousel";
import { useMemo } from "react";

export default function NewsBannerSlider() {
  const { data, isLoading, isError } = useInfiniteNewsQuery();

  const newsList = data?.pages.flatMap((page) => page.basicInfoList) || [];
  
  const carouselItems = useMemo(() => {
    return newsList.slice(0, 5).map((news) => {
      const isValidSrc = news.thumbnailUrl && news.thumbnailUrl !== "string" && 
        (news.thumbnailUrl.startsWith("/") || news.thumbnailUrl.startsWith("http"));
        
      return {
        id: news.newsId,
        imageUrl: isValidSrc ? news.thumbnailUrl : "/news_sample.svg",
        title: news.title,
        description: news.description,
        link: `/news/${news.newsId}`,
      };
    });
  }, [newsList]);

  if (isLoading) {
    return (
      <div className="relative h-[297px] t:h-[424px] w-full overflow-hidden rounded-[10px] bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">소식을 불러오는 중...</div>
      </div>
    );
  }

  if (isError || carouselItems.length === 0) {
    return (
      <div className="relative h-[297px] t:h-[424px] w-full overflow-hidden rounded-[10px] bg-gray-50 flex flex-col items-center justify-center gap-2">
        <div className="text-gray-400 text-lg font-medium">새로운 소식이 아직 없어요!</div>
        <div className="text-gray-400 text-sm">준비 중인 소식을 기다려 주세요.</div>
      </div>
    );
  }

  return (
    <SwipeCarousel 
      items={carouselItems}
      heightClass="h-[297px] t:h-[424px]"
      maxWidthClass="w-full"
      showTitleLarge={false}
    />
  );
}
