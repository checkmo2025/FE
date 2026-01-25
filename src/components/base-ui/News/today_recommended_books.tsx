"use client";

import { useState } from "react";
import BookCoverCard from "./recommendbook_element";

type Book = {
  id: number;
  imgUrl: string;
  title: string;
  author: string;
};

type TodayRecommendedBooksProps = {
  books: Book[];
  className?: string;
};

export default function TodayRecommendedBooks({
  books,
  className = "",
}: TodayRecommendedBooksProps) {
  const [likedBooks, setLikedBooks] = useState<Record<number, boolean>>({});

  const handleLikeChange = (bookId: number, liked: boolean) => {
    setLikedBooks((prev) => ({
      ...prev,
      [bookId]: liked,
    }));
  };

  return (
    <div className={`flex flex-col items-center mb-8 ${className}`}>
      <div className="w-full max-w-[1040px]">
        <h2 className="headline_3 leading-7 text-center t:text-start text-gray-700 mb-7">오늘의 추천 책</h2>
        <div className="flex gap-5 flex-wrap justify-center t:justify-start">
          {books.map((book) => (
            <BookCoverCard
              key={book.id}
              imgUrl={book.imgUrl}
              title={book.title}
              author={book.author}
              liked={likedBooks[book.id] || false}
              onLikeChange={(liked) => handleLikeChange(book.id, liked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
