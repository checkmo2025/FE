"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInfiniteNewsQuery } from "@/hooks/queries/useNewsQueries";

export default function NewsListBanner() {
    const router = useRouter();
    const [index, setIndex] = useState(0);

    const { data, isLoading, isError } = useInfiniteNewsQuery();

    const newsList = data?.pages.flatMap((page) => page.basicInfoList) || [];

    // 'PROMOTION' 태그가 붙은 소식만 필터링 및 게시 종료 날짜 순 정렬 (최대 5개)
    const promotionList = useMemo(() => {
        return newsList
            .filter((news) => news.carousel === "PROMOTION")
            .sort((a, b) => new Date(b.publishEndAt).getTime() - new Date(a.publishEndAt).getTime())
            .slice(0, 5);
    }, [newsList]);

    const slideCount = promotionList.length;

    // 5초 자동 슬라이드 로직
    useEffect(() => {
        if (slideCount <= 1) return;

        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slideCount);
        }, 5000);

        return () => clearInterval(timer);
    }, [slideCount]);

    if (isLoading) {
        return (
            <div className="relative h-[297px] t:h-[468px] w-full max-w-[1040px] overflow-hidden rounded-[10px] bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">소식을 불러오는 중...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="relative h-[297px] t:h-[468px] w-full max-w-[1040px] overflow-hidden rounded-[10px] bg-gray-50 flex flex-col items-center justify-center gap-2 border border-Gray-1">
                <div className="text-gray-400 text-lg font-medium">소식을 불러오지 못했어요.</div>
            </div>
        );
    }

    if (slideCount === 0) {
        return (
            <div className="relative h-[297px] t:h-[468px] w-full max-w-[1040px] overflow-hidden rounded-[10px] bg-gray-50 flex flex-col items-center justify-center gap-2 border border-Gray-1">
                <div className="text-gray-400 text-lg font-medium text-center px-4">책모의 소식에서 다양한 책 관련 행사를 알아보세요!</div>
            </div>
        );
    }

    const safeIndex = index % slideCount;

    const isValidSrc = (src: string) => {
        return src && src !== "string" && (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://"));
    };

    return (
        <div className="relative h-[297px] t:h-[468px] w-full max-w-[1040px] overflow-hidden rounded-[10px] shadow-sm">
            {promotionList.map((news, i) => {
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

                        {/* Text Overlay - 텍스트 포함 요청 반영 */}
                        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 p-6 t:p-10 flex flex-col justify-center items-end bg-gradient-to-l from-black/60 via-black/30 to-transparent text-right">
                            <div className="flex flex-col gap-2 t:gap-3 text-white">
                                <h3 className="text-xl t:text-3xl font-bold leading-tight drop-shadow-lg">
                                    {news.title}
                                </h3>
                                <p className="text-xs t:text-base text-white/90 line-clamp-3 t:line-clamp-4 max-w-[240px] t:max-w-[400px] whitespace-pre-line drop-shadow-md font-light">
                                    {news.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 인디케이터 */}
            <div className="absolute top-[20px] left-[20px] t:top-[27px] t:left-[33px] flex gap-2 z-20">
                {promotionList.map((_, i) => {
                    const active = i === safeIndex;

                    return (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIndex(i);
                            }}
                            aria-label={`배너 ${i + 1}`}
                            className={`transition-all duration-300 ${active
                                    ? "w-6 h-2 rounded-[100px] bg-primary-1"
                                    : "w-2 h-2 rounded-full bg-white/50 hover:bg-white"
                                }`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
