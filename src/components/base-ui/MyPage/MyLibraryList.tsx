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
    <div className="flex flex-wrap items-center content-center w-full justify-center gap-[16px] mx-auto md:w-[774px] md:justify-between md:gap-[21px] md:gap-y-[16px] lg:w-[1048px] lg:gap-x-0 lg:gap-y-[16px]">
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
