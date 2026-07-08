"use client";

import { useEffect, useMemo } from "react";
import NewsList from "@/components/base-ui/News/news_list";
import TodayRecommendedBooks from "@/components/base-ui/News/today_recommended_books";
import FloatingFab from "@/components/base-ui/Float";
import { useRecommendedBooksQuery } from "@/hooks/queries/useBookQueries";
import { useInfiniteNewsQuery } from "@/hooks/queries/useNewsQueries";
import { useInView } from "react-intersection-observer";
import { EXTERNAL_LINKS } from "@/constants/links";
import { Book } from "@/types/book";
import NewsListBanner from "@/components/base-ui/News/NewsListBanner";

export default function NewsPageClient() {
  const { data: recommendedData, isLoading: isLoadingRecommended } = useRecommendedBooksQuery();
  const {
    data: newsData,
    isLoading: isLoadingNews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteNewsQuery();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recommendedBooks = useMemo(() => {
    return (recommendedData?.detailInfoList || []).map((book: Book) => ({
      id: book.isbn,
      imgUrl: book.imgUrl,
      title: book.title,
      author: book.author,
      likedByMe: book.likedByMe,
    }));
  }, [recommendedData]);

  const newsList = newsData?.pages.flatMap((page) => page.basicInfoList) || [];

  const isValidSrc = (src: string) => {
    return src && src !== "string" && (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://"));
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 overflow-x-hidden no-scrollbar pb-8 d:pb-20">
      <div className="flex justify-center items-center mt-7 mb-3 t:mb-6">
        <NewsListBanner />
      </div>

      {!isLoadingRecommended && recommendedBooks.length > 0 && (
        <TodayRecommendedBooks books={recommendedBooks} className="d:hidden" />
      )}

      <section className="mt-8 w-full max-w-[1040px] mx-auto">
        <h2 className="mb-4 text-xl font-bold text-Zinc-800">새로운 소식</h2>

        {isLoadingNews ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2" />
          </div>
        ) : newsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-400">등록된 소식이 없습니다.</p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-4 overflow-y-auto no-scrollbar pr-2 max-h-[calc(100vh-200px)] d:max-h-[calc(100vh-400px)] min-h-[400px]"
          >
            {newsList.map((news) => (
              <NewsList
                key={news.newsId}
                id={news.newsId}
                imageUrl={isValidSrc(news.thumbnailUrl) ? news.thumbnailUrl : "/news_sample.svg"}
                title={news.title}
                content={news.description}
                date={news.publishStartAt}
              />
            ))}

            <div ref={ref} className="h-10 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-1" />
              )}
            </div>
          </div>
        )}
      </section>

      <div className="hidden d:block w-full my-8 border-b-4 border-Gray-1"></div>

      {!isLoadingRecommended && recommendedBooks.length > 0 && (
        <TodayRecommendedBooks books={recommendedBooks} className="hidden d:flex" />
      )}

      <FloatingFab
        iconSrc="/icons_calling.svg"
        iconAlt="소식 문의하기"
        onClick={() => window.open(EXTERNAL_LINKS.NEWS_FROM_URL, "_blank")}
      />
    </div>
  );
}
