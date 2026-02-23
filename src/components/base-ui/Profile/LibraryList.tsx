"use client";

import React, { useState } from "react";
import { DUMMY_LIBRARY_BOOKS } from "@/constants/mocks/mypage";
import LibraryCard from "./items/LibraryCard";

const LibraryList = () => {
  const [likedBooks, setLikedBooks] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedBooks((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };
  return (
    <div className="grid grid-cols-3 gap-x-[18px] gap-y-[12px] px-[18px] md:px-[40px] lg:px-0 w-full max-w-[1048px] mx-auto md:flex md:flex-wrap md:justify-between md:gap-[21px] md:gap-y-[16px] lg:gap-x-0 lg:gap-y-[16px] [&>div]:w-full md:[&>div]:w-[244px]">
      {DUMMY_LIBRARY_BOOKS.map((book) => (
        <LibraryCard
          key={book.id}
          book={book}
          isLiked={likedBooks.includes(book.id)}
          onToggleLike={toggleLike}
        />
      ))}
    </div>
  );
};

export default LibraryList;
