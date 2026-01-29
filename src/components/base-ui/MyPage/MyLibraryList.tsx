"use client";

import React, { useState } from "react";
import { DUMMY_LIBRARY_BOOKS } from "@/constants/mocks/mypage";
import MyLibraryCard from "./items/MyLibraryCard";

const MyLibraryList = () => {
  const [likedBooks, setLikedBooks] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedBooks((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };
  return (
    <div className="grid grid-cols-3 gap-x-[18px] gap-y-[12px] px-[18px] w-full mx-auto md:flex md:flex-wrap md:justify-between md:gap-[21px] md:gap-y-[16px] md:w-[774px] md:px-0 lg:w-[1048px] lg:gap-x-0 lg:gap-y-[16px] [&>div]:w-full md:[&>div]:w-[244px]">
      {DUMMY_LIBRARY_BOOKS.map((book) => (
        <MyLibraryCard
          key={book.id}
          book={book}
          isLiked={likedBooks.includes(book.id)}
          onToggleLike={toggleLike}
        />
      ))}
    </div>
  );
};

export default MyLibraryList;
