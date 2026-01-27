"use client";

import React, { useState } from "react";
import Image from "next/image";

const DUMMY_LIBRARY_BOOKS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  src: "/BookImgSample.svg",
  title: `책 제목 ${i + 1}`,
  author: "저자 이름",
  publisher: "출판사",
  description: "이 책은 정말 재미있는 책입니다. 독서 모임에서 함께 읽어보세요.",
}));

const MyLibraryList = () => {
  const [likedBooks, setLikedBooks] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedBooks((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };
  return (
    <div className="w-[1048px] flex flex-wrap justify-between items-center content-center gap-y-[16px]">
      {DUMMY_LIBRARY_BOOKS.map((book) => {
        const isLiked = likedBooks.includes(book.id);
        return (
          <div
            key={book.id}
            className="relative flex flex-col justify-end items-start gap-[10px] w-[244px] h-[320px] p-[12px] rounded-[4px] shrink-0 cursor-pointer"
            style={{
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.30) 82.79%), url('${book.src}') lightgray 50% / cover no-repeat`,
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(book.id);
              }}
              className="w-[24px] h-[24px]"
            >
              <Image
                src={isLiked ? "/red_heart.svg" : "/gray_heart.svg"}
                alt="like"
                width={24}
                height={24}
              />
            </button>

            <div className="flex flex-col items-start gap-[4px] w-full">
              <span className="text-white text-[18px] font-bold leading-tight truncate w-full">
                {book.title}
              </span>
              <span className="text-gray-200 text-[14px] font-medium truncate w-full">
                {book.author}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyLibraryList;
