"use client";

import { useState } from "react";
import LibraryCard from "@/components/base-ui/Profile/items/LibraryCard";

// Mock Data
const MOCK_LIBRARY_BOOKS = [
  {
    id: 1,
    title: "불편한 편의점",
    author: "김호연",
    coverImg: "/dummy_book_1.png",
  },
  { id: 2, title: "아몬드", author: "손원평", coverImg: "/dummy_book_2.png" },
  {
    id: 3,
    title: "미드나잇 라이브러리",
    author: "매트 헤이그",
    coverImg: "/dummy_book_3.png",
  },
  {
    id: 4,
    title: "달러구트 꿈 백화점",
    author: "이미예",
    coverImg: "/dummy_book_4.png",
  },
  {
    id: 5,
    title: "지구 끝의 온실",
    author: "김초엽",
    coverImg: "/dummy_book_5.png",
  },
  {
    id: 6,
    title: "물고기는 존재하지 않는다",
    author: "룰루 밀러",
    coverImg: "/dummy_book_6.png",
  },
];

export default function LibraryList() {
  const [likedBooks, setLikedBooks] = useState<number[]>([]);

  const handleToggleLike = (id: number) => {
    setLikedBooks((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="grid w-full justify-center 
      md:w-[688px] md:grid-cols-3 md:gap-x-[21.5px] md:gap-y-[16px]
      xl:w-[1048px] xl:grid-cols-4 xl:gap-x-[24px] xl:gap-y-[16px]"
    >
      {MOCK_LIBRARY_BOOKS.map((book) => (
        <LibraryCard
          key={book.id}
          book={book}
          isLiked={likedBooks.includes(book.id)}
          onToggleLike={handleToggleLike}
        />
      ))}
    </div>
  );
}
