"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchBookResult from "@/components/base-ui/Search/search_bookresult";

type BookSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bookId: number) => void;
};

export default function BookSelectModal({
  isOpen,
  onClose,
  onSelect,
}: BookSelectModalProps) {
  const router = useRouter();
  const [topOffset, setTopOffset] = useState(0);
  const [likedResults, setLikedResults] = useState<Record<number, boolean>>({});
  const [searchValue, setSearchValue] = useState("");

  // 더미 데이터
  const searchResults = [
    {
      id: 1,
      imgUrl: "/booksample.svg",
      title: "어린 왕자",
      author: "김개미, 연수",
      detail: "최대 500(넘어가면...으로)",
    },
    {
      id: 2,
      imgUrl: "/booksample.svg",
      title: "어린 왕자",
      author: "김개미, 연수",
      detail: "최대 500(넘어가면...으로)",
    },
    {
      id: 3,
      imgUrl: "/booksample.svg",
      title: "어린 왕자",
      author: "김개미, 연수",
      detail: "최대 500(넘어가면...으로)",
    },
  ];

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/50 -z-10" />

      {/* 모달 */}
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-[1121px] max-h-[60vh] t:max-h-[748px] overflow-hidden flex flex-col d:px-10 py-2 t:py-6 d:py-6"
        onClick={(e) => e.stopPropagation()}
      >
          {/* 검색창 */}
          <div className="px-4 py-3 t:px-6 t:py-4 border-b border-Subbrown-4">
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
          <div className="px-4 py-2 t:px-6 t:py-4 overflow-y-auto flex-1">
            <p className="text-Gray-4 body_1_2 t:subhead_4_1 mb-14">
              총 <span className="text-primary-3">{searchResults.length}개</span>의
              검색결과가 있습니다.
            </p>
            <div className="flex flex-col gap-4">
              {searchResults.map((result) => (
                <SearchBookResult
                  key={result.id}
                  imgUrl={result.imgUrl}
                  title={result.title}
                  author={result.author}
                  detail={result.detail}
                  liked={likedResults[result.id] || false}
                  onLikeChange={(liked) =>
                    setLikedResults((prev) => ({ ...prev, [result.id]: liked }))
                  }
                  onPencilClick={() => {
                    // 책 선택 시
                    onSelect(result.id);
                    onClose();
                  }}
                  onCardClick={() => {
                    // 책 선택 시
                    onSelect(result.id);
                    onClose();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

  );
}
