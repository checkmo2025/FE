"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import SearchBookResult from "@/components/base-ui/Search/search_bookresult";
import { useInfiniteBookSearchQuery } from "@/hooks/queries/useBookQueries";
import { useInView } from "react-intersection-observer";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);
  const [likedResults, setLikedResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const {
    data: searchData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteBookSearchQuery(query);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const searchResults = useMemo(() => {
    return searchData?.pages.flatMap((page) => page.detailInfoList) || [];
  }, [searchData]);

  const totalResults = useMemo(() => {
    // Note: If the API doesn't return total count, we can only show what's loaded 
    // or just say "many" or keep it as is. Assuming we show loaded count for now.
    return searchResults.length;
  }, [searchResults]);

  return (
    <>
      <div className="max-w-[1040px] mx-auto mt-6">
        <div className="px-2 mx-8 t:mx-10 t:px-6 py-3 t:py-4 border-b-2 border-Subbrown-4">
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6 t:w-12 t:h-12 shrink-0 mr-4 t:mr-7.5">
              <Image
                src="/dark_search.svg"
                alt="검색"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative flex-1 flex items-center h-full overflow-hidden">
              <input
                type="text"
                placeholder="책 제목, 작가 이름을 검색해보세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent text-Gray-7 subhead_3 t:headline_3 placeholder:text-Gray-4 focus:outline-none pr-10"
                autoFocus
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue("")}
                  className="absolute right-2.5 flex items-center justify-center shrink-0 z-10 w-5 h-5 t:w-7 t:h-7"
                  aria-label="검색어 지우기"
                >
                  <Image
                    src="/light_close.svg"
                    alt="지우기"
                    width={28}
                    height={28}
                    className="object-contain w-full h-full"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="max-w-[1040px] mx-auto t:px-8 min-h-screen">
        <div className="px-4 py-6 t:px-6 t:py-8">
          <p className="max-w-[1040px] text-Gray-4 body_1_3 t:subhead_4_1 ml-2 t:ml-0 mb-4">
            총 <span className="text-primary-3">{totalResults}개</span>의 검색결과가 있습니다.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            {searchResults.map((result) => (
              <SearchBookResult
                key={result.isbn}
                imgUrl={result.imgUrl}
                title={result.title}
                author={result.author}
                detail={result.description}
                liked={likedResults[result.isbn] || false}
                onLikeChange={(liked) =>
                  setLikedResults((prev) => ({ ...prev, [result.isbn]: liked }))
                }
                onPencilClick={() => {
                  router.push(`/books/${result.isbn}`); //필요한지 확인 필요
                }}
                onCardClick={() => {
                  router.push(`/books/${result.isbn}`);
                }}
              />
            ))}
          </div>

          {/* 무한 스크롤 로딩 트리거 */}
          <div ref={ref} className="h-10 flex items-center justify-center mt-4">
            {isFetchingNextPage && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-3"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
