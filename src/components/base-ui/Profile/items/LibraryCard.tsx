"use client";

import Image from "next/image";

type LibraryBookProps = {
  id: number;
  title: string;
  author: string;
  coverImg: string;
};

type Props = {
  book: LibraryBookProps;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
};

export default function LibraryCard({ book, isLiked, onToggleLike }: Props) {
  return (
    <div
      className={`
        relative flex flex-col items-start justify-end gap-[10px] overflow-hidden rounded-[4px] p-[12px] shrink-0
        
        /* Tablet (md): w 215px, h 282px */
        w-full md:w-[215px] md:h-[282px]
        
        /* Desktop (xl): w 244px, h 320px */
        xl:w-[244px] xl:h-[320px]
      `}
      style={{
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.30) 82.79%)`,
      }}
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={book.coverImg}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 215px, 244px"
        />
      </div>

      {/* 좋아요 아이콘 */}
      <button
        type="button"
        onClick={() => onToggleLike(book.id)}
        className="relative h-[24px] w-[24px] shrink-0 transition-transform hover:scale-110 active:scale-95"
      >
        <Image
          src={isLiked ? "/red_heart.svg" : "/gray_heart.svg"}
          alt={isLiked ? "좋아요 취소" : "좋아요"}
          fill
          className="object-contain"
        />
      </button>

      {/* 텍스트 영역 */}
      <div className="flex flex-col items-start gap-[4px] self-stretch">
        {/* 책 제목  */}
        <h3 className="self-stretch truncate text-[24px] font-semibold leading-[135%] tracking-[-0.024px] text-white">
          {book.title}
        </h3>
        {/* 작가  */}
        <p className="self-stretch truncate text-[18px] font-normal leading-[135%] tracking-[-0.018px] text-white">
          {book.author}
        </p>
      </div>
    </div>
  );
}
