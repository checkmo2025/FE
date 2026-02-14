"use client";

import Image from "next/image";
import { MyPageLibraryBook } from "@/types/mypage";

interface LibraryCardProps {
  book: MyPageLibraryBook;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
}

const LibraryCard = ({ book, isLiked, onToggleLike }: LibraryCardProps) => {
  return (
    <div
      className="relative flex flex-col justify-end items-start gap-[8px] md:gap-[10px] w-[102px] h-[132px] p-[8px] md:w-[244px] md:h-[320px] md:p-[12px] rounded-[4px] shrink-0 cursor-pointer overflow-hidden"
    >
      <Image
        src={book.src}
        alt={book.title}
        fill
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.30) 82.79%)",
        }}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(book.id);
        }}
        className="relative z-10 w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
      >
        <Image
          src={isLiked ? "/red_heart.svg" : "/gray_heart.svg"}
          alt="like"
          width={24}
          height={24}
          priority
        />
      </button>

      <div className="relative z-10 flex flex-col items-start gap-[4px] w-full">
        <h3 className="text-white text-[18px] font-bold leading-tight truncate w-full">
          {book.title}
        </h3>
        <p className="text-gray-200 text-[14px] font-medium truncate w-full">
          {book.author}
        </p>
      </div>
    </div>
  );
};

export default LibraryCard;
