"use client";

import BookcaseCard from "@/components/base-ui/Bookcase/BookcaseCard";
import Image from "next/image";
import React from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  category: {
    generation: string;
    genre: string;
  };
  rating: number;
  description: string;
  imageUrl?: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (book: Book) => void;

  books?: Book[];
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

export default function BookshelfModal({
  isOpen,
  onClose,
  onSelect,
  books: booksProp,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  if (!isOpen) return null;


  const books = booksProp ?? [];
  const isEmpty = books.length === 0;

  const handleCardClick = (book: Book) => {
    onSelect?.(book);
    onClose();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onLoadMore) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
    if (nearBottom) onLoadMore();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 t:block hidden"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-stretch t:items-center justify-center">
        <div
          className="
            w-full h-full
            bg-background
            flex flex-col
            p-4
            t:p-10 t:shadow-lg t:rounded-[8px]
            t:w-[72vw] t:max-w-[1120px]
            t:h-[72vh] t:max-h-[748px]
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 t:mb-4">
            <button
              type="button"
              onClick={onClose}
              className="t:hidden flex items-center gap-2 body_1_2 text-Gray-7"
              aria-label="뒤로가기"
            >
              <Image src="/chevron_left.svg" alt="" width={20} height={20} />
              뒤로가기
            </button>

            <p className="hidden t:block subhead_4_1 text-Gray-7">책장 등록</p>

            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="hidden t:block"
            >
              <Image src="/light_close.svg" alt="닫기" width={24} height={24} />
            </button>
          </div>

          <p className="t:hidden subhead_4_1 text-Gray-7 mb-3">책장 등록</p>

          <div
            className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-none"
            onScroll={handleScroll}
          >
          {isEmpty ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="body_1_2 text-Gray-4">책장이 비었습니다.</p>
            </div>
          ) : (
            <div
              className="
                grid
                gap-[10px]
                justify-center
                [grid-template-columns:repeat(auto-fit,166px)]
                t:[grid-template-columns:repeat(auto-fit,200px)]
              "
            >
              {books.map((book) => (
                <div
                  key={book.id}
                  className="cursor-pointer"
                  onClick={() => handleCardClick(book)}
                >
                  <BookcaseCard
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    rating={book.rating}
                    onTopicClick={() => {}}
                    onReviewClick={() => {}}
                    onMeetingClick={() => {}}
                    imageUrl={book.imageUrl ?? ""}
                  />
                </div>
              ))}
            </div>
          )}

          </div>

          <div className="t:hidden h-4" />
        </div>
      </div>
    </div>
  );
}