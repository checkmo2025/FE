"use client";

import { useEffect } from "react";
import NewsList from "@/components/base-ui/News/news_list";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useInfiniteNewsQuery } from "@/hooks/queries/useNewsQueries";
import { useInView } from "react-intersection-observer";

export default function MyNewsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteNewsQuery();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the pages to a single array of basicInfoList
  const newsList = data?.pages.flatMap((page) => page.basicInfoList) || [];

  return (
    <SettingsDetailLayout
      title="내 소식 관리"
      mode="wide"
      className="gap-[8px] xl:w-auto xl:px-0"
    >
      <div className="w-full flex-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]">
        <div className="flex flex-col gap-[8px]">
          {isLoading && <p className="text-Gray-4 text-center py-4">로딩 중...</p>}

          {!isLoading && newsList.length === 0 && (
            <p className="text-Gray-4 text-center py-4">등록된 소식이 없습니다.</p>
          )}

          {newsList.map((news) => (
            <NewsList
              key={news.newsId}
              id={news.newsId}
              title={news.title}
              content={news.description}
              date={news.publishStartAt}
              imageUrl={news.thumbnailUrl}
              className="w-full"
            />
          ))}

          {/* Infinite Scroll Trigger */}
          <div ref={ref} className="h-4 w-full" />

          {isFetchingNextPage && (
            <p className="text-Gray-4 text-center py-4">추가 소식을 불러오는 중...</p>
          )}
        </div>
      </div>
    </SettingsDetailLayout>
  );
}
