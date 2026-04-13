"use client";

import { useEffect, useState, useMemo } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import Image from "next/image";
import { useInfiniteBookSearchQuery } from "@/hooks/queries/useBookQueries";
import { useDebounce } from "@/hooks/useDebounce";
import SearchBookResult from "@/components/base-ui/Search/search_bookresult";
import { useInView } from "react-intersection-observer";
import { Book } from "@/types/book";

type BookSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (isbn: string) => void;
};

export default function BookSelectModal({
  isOpen,
  onClose,
  onSelect,
}: BookSelectModalProps) {
  const [likedResults, setLikedResults] = useState<Record<string, boolean>>({});
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: searchData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteBookSearchQuery(debouncedSearchValue);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const searchResults = useMemo(() => {
    return searchData?.pages.flatMap((page) => page.detailInfoList) || [];
  }, [searchData]);

  const handleSearch = () => {
    // 실시간 검색으로 대체
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useScrollLock(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const openLinkNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed top-[60px] left-0 right-0 bottom-0 t:inset-0 z-50 flex items-center justify-center p-0 t:p-4"
      onClick={onClose}
    >
      {/* 배경 오버레이 - 태블릿/데스크탑에서만 */}
      <div className="hidden t:block fixed inset-0 bg-black/50 -z-10" />

      {/* 모달/전체화면 */}
      <div
        className="bg-background w-full h-full t:rounded-lg t:shadow-lg t:max-w-[1121px] t:max-h-[748px] t:h-auto overflow-hidden flex flex-col d:px-10 py-0 t:py-6 d:py-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 검색창 */}
        <div className="px-4 py-5 t:px-6 t:py-4 border-b border-Subbrown-4">
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

        {/* 검색 결과 */}
        <div className="py-2 t:px-6 t:py-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-Gray-4 body_1">검색 중...</p>
            </div>
          ) : (
            <>
              <p className="text-Gray-4 subhead_4_1 mb-4 t:mb-14 px-5">
                총 <span className="text-primary-3">{searchResults.length}개</span>
                의 검색결과가 있습니다.
              </p>
              <div className="flex flex-col gap-4">
                {searchResults.map((result: Book) => (
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
                    // ✅ 카드 클릭: link 새 탭
                    onCardClick={() => openLinkNewTab(result.link)}
                    // ✅ 연필 클릭: 기존 선택 로직
                    onPencilClick={() => {
                      onSelect(result.isbn);
                      onClose();
                    }}
                  />
                ))}
              </div>

              {/* 무한 스크롤 로딩 트리거 */}
              <div ref={ref} className="h-10 flex items-center justify-center mt-4 mb-4">
                {isFetchingNextPage && (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-3"></div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}