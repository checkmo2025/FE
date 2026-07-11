"use client";

import { useInfiniteNewsQuery } from "@/hooks/queries/useNewsQueries";
import SwipeCarousel from "@/components/common/SwipeCarousel";
import { useMemo } from "react";

export default function NewsListBanner() {
    const { data, isLoading, isError } = useInfiniteNewsQuery();

    const newsList = data?.pages.flatMap((page) => page.basicInfoList) || [];

    // 'PROMOTION' 태그가 붙은 소식만 필터링 및 게시 종료 날짜 순 정렬 (최대 5개)
    const carouselItems = useMemo(() => {
        return newsList
            .filter((news) => news.carousel === "PROMOTION")
            .sort((a, b) => new Date(b.publishEndAt).getTime() - new Date(a.publishEndAt).getTime())
            .slice(0, 5)
            .map((news) => {
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
            <div className="relative h-[297px] t:h-[468px] w-full max-w-[1040px] mx-auto overflow-hidden rounded-[10px] bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">소식을 불러오는 중...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="relative h-[297px] t:h-[468px] w-full max-w-[1040px] mx-auto overflow-hidden rounded-[10px] bg-gray-50 flex flex-col items-center justify-center gap-2 border border-Gray-1">
                <div className="text-gray-400 text-lg font-medium">소식을 불러오지 못했어요.</div>
            </div>
        );
    }

    if (carouselItems.length === 0) {
        return (
            <div className="relative h-[297px] t:h-[468px] w-full max-w-[1040px] mx-auto overflow-hidden rounded-[10px] bg-gray-50 flex flex-col items-center justify-center gap-2 border border-Gray-1">
                <div className="text-gray-400 text-lg font-medium text-center px-4">책모의 소식에서 다양한 책 관련 행사를 알아보세요!</div>
            </div>
        );
    }

    return (
        <SwipeCarousel 
            items={carouselItems}
            heightClass="h-[297px] t:h-[468px]"
            maxWidthClass="w-full max-w-[1040px]"
            showTitleLarge={true}
        />
    );
}
