"use client";

import React from "react";
import Image from "next/image";
import { MyPageLibraryBook } from "@/types/mypage";

interface MyLibraryCardProps {
  book: MyPageLibraryBook;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
}

const MyLibraryCard = ({ book, isLiked, onToggleLike }: MyLibraryCardProps) => {
  return (
    <div
      className="relative flex flex-col justify-end items-start gap-[10px] w-[244px] h-[320px] p-[12px] rounded-[4px] shrink-0 cursor-pointer"
      style={{
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.30) 82.79%), url('${book.src}') lightgray 50% / cover no-repeat`,
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(book.id);
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
};

export default MyLibraryCard;
