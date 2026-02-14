"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Search_BookCoverCard from "@/components/base-ui/Search/search_recommendbook";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [topOffset, setTopOffset] = useState(0);
  const [likedBooks, setLikedBooks] = useState<Record<number, boolean>>({});
  const [searchValue, setSearchValue] = useState("");

  // 더미 추천 책 데이터
  const recommendedBooks = [
    { id: 1, imgUrl: "/booksample.svg", title: "책 제목", author: "작가작가작가" },
    { id: 2, imgUrl: "/booksample.svg", title: "책 제목", author: "작가작가작가" },
    { id: 3, imgUrl: "/booksample.svg", title: "책 제목", author: "작가작가작가" },
    { id: 4, imgUrl: "/booksample.svg", title: "책 제목", author: "작가작가작가" },
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
    if (isOpen) {
      const header = document.querySelector("header");
      if (header) {
        setTopOffset(header.offsetHeight);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // body 스크롤 막기
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      // body 스크롤 복원
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 블러 */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-black/50 backdrop-blur-xs z-40"
        onClick={onClose}
        style={{ top: `${topOffset}px` }}
      />
      
      {/* 모달 */}
      <div
        className="fixed left-0 right-0 z-50 bg-primary-1 border-b border-white/20"
        style={{ top: `${topOffset}px` }}
      >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-3 t:px-10 t:py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 t:w-8 t:h-8 d:w-12 d:h-12 shrink-0 mr-5 t:mr-7.5">
            <Image
              src="/thick_search.svg"
              alt="검색"
              fill
              className="object-contain "
            />
          </div>
          <div className="relative flex-1 flex items-center h-full overflow-hidden">
            <input
              type="text"
              placeholder="책 제목, 작가 이름을 검색해보세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full bg-transparent text-white subhead_4 t:subhead_1 d:headline_3 placeholder:subbrown_3 focus:outline-none pr-10"
              autoFocus
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-2.5 flex items-center justify-center shrink-0 z-10 w-4 h-4 t:w-6 t:h-6 d:w-7 d:h-7"
                aria-label="검색어 지우기"
              >
                <Image
                  src="/dark_close.svg"
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

      <div className="mx-auto w-full max-w-[1440px] px-4 t:px-10 d:px-[40px]">
        <div className="border-b-2 border-background"></div>
      </div>

      {/* 오늘의 추천 책 */}
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 t:px-7 t:py-5 mt-2">
        <h3 className="text-white subhead_1 mb-6">오늘의 추천 책</h3>
        <div className="flex gap-2 t:gap-4 overflow-x-auto">
          {recommendedBooks.slice(0, 4).map((book, index) => (
            <div key={book.id} className={index === 3 ? "hidden d:block" : ""}>
              <Search_BookCoverCard
                imgUrl={book.imgUrl}
                title={book.title}
                author={book.author}
                liked={likedBooks[book.id] || false}
                onLikeChange={(liked) =>
                  setLikedBooks((prev) => ({ ...prev, [book.id]: liked }))
                }
              />
            </div>
          ))}
        </div>
        <div className="flex t:mx-8 d:mx-8 justify-end mt-4">
          <Link
            href="#"
            className="flex items-center gap-1 text-white body_1_2 t:subhead_4_1 hover:opacity-80 border-b border-white"
          >
            <span>알라딘 랭킹 더 보러가기</span>
            <div className="relative w-6 h-6">
              <Image
                src="/to_aladin.svg"
                alt="알라딘"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
