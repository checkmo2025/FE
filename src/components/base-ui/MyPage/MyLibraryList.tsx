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
    <div className="w-[1048px] flex flex-wrap justify-between items-center content-center gap-y-[16px]">
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
