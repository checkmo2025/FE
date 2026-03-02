"use client";

import { useState } from "react";
import BookCoverCard from "@/components/base-ui/Book/BookCoverCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useToggleBookLikeMutation } from "@/hooks/mutations/useBookMutations";

type Book = {
  id: string | number;
  imgUrl: string;
  title: string;
  author: string;
  likedByMe?: boolean;
};

type TodayRecommendedBooksProps = {
  books: Book[];
  className?: string;
};

export default function TodayRecommendedBooks({
  books,
  className = "",
}: TodayRecommendedBooksProps) {
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const { mutate: toggleLike } = useToggleBookLikeMutation();

  const handleLikeChange = (bookId: string | number) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleLike(String(bookId));
  };

  // 모바일: 2개, 태블릿: 4개, 데스크탑: 전체
  const mobileBooks = books.slice(0, 2);
  const tabletBooks = books.slice(0, 4);

  return (
    <div className={`flex flex-col items-center mb-8 ${className}`}>
      <div className="w-full max-w-[1040px] border-t-4 border-Gray-1 d:border-none pt-5">
        <h2 className="subhead_1 t:headline_3 leading-7 t:ml-5 ml-2 text-start text-gray-700 mb-3">오늘의 추천 책</h2>

        {/* 모바일: 2개 */}
        <div className="flex gap-5 flex-wrap justify-center t:hidden">
          {mobileBooks.map((book) => (
            <BookCoverCard
              key={book.id}
              imgUrl={book.imgUrl}
              title={book.title}
              author={book.author}
              liked={book.likedByMe || false}
              onLikeChange={() => handleLikeChange(book.id)}
              responsive
            />
          ))}
        </div>

        {/* 태블릿: 4개 */}
        <div className="hidden t:flex d:hidden gap-5 flex-wrap justify-center">
          {tabletBooks.map((book) => (
            <BookCoverCard
              key={book.id}
              imgUrl={book.imgUrl}
              title={book.title}
              author={book.author}
              liked={book.likedByMe || false}
              onLikeChange={() => handleLikeChange(book.id)}
              responsive
            />
          ))}
        </div>

        {/* 데스크탑: 전체 */}
        <div className="hidden d:flex gap-5 flex-wrap justify-start">
          {books.map((book) => (
            <BookCoverCard
              key={book.id}
              imgUrl={book.imgUrl}
              title={book.title}
              author={book.author}
              liked={book.likedByMe || false}
              onLikeChange={() => handleLikeChange(book.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
