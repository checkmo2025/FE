"use client";

import Image from "next/image";

type Props = {
  imageUrl?: string;
  title: string;
  author: string;
  description: string;
  category: {
    generation: string; // 예: "7기"
    genre: string; // 예: "소설/시/희곡"
  };
  rating: number; // 0 ~ 5
};

export default function BookDetailCard({
  imageUrl = "/dummy_book_cover.png",
  title,
  author,
  description,
  category,
  rating,
}: Props) {
  // 별점 렌더링 헬퍼
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const isFull = i < Math.floor(rating);
      return (
        <div key={i} className="relative h-[24px] w-[24px]">
          <Image
            src={isFull ? "/full_star.svg" : "/empty_star.svg"}
            alt={isFull ? "full star" : "empty star"}
            fill
            className="object-contain"
          />
        </div>
      );
    });
  };

  return (
    // [책장_도서 상세]
    <div className="flex items-center gap-[24px] self-stretch">
      {/* 1. 도서 이미지 */}
      <div className="relative h-[230px] w-[159px] shrink-0 bg-Gray-2 shadow-sm overflow-hidden rounded-[4px]">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* 2. 상세 정보 영역 (Frame 2087328745) */}
      <div className="flex h-[230px] w-[857px] flex-col items-start gap-[20px]">
        {/* 상단 정보 그룹 (Frame 2087328717) */}
        <div className="flex w-[132px] flex-col items-start gap-[24px] flex-1">
          {/* 제목/저자/배지 (Frame 2087328715) */}
          <div className="flex w-[115px] flex-col items-start gap-[4px]">
            {/* 제목 & 저자 */}
            <div className="flex w-[61px] flex-col items-start">
              <span className="self-stretch truncate body_1 text-Gray-7">
                {title}
              </span>
              <span className="self-stretch truncate body_2_2 text-Gray-4">
                {author}
              </span>
            </div>

            {/* 카테고리 배지 (Frame 2087328708) */}
            <div className="flex items-center gap-[4px] self-stretch">
              {/* 기수 */}
              <div className="flex items-center justify-center rounded-[4px] bg-primary-2 px-[8px] py-[2px]">
                <span className="body_2_2 text-White whitespace-nowrap">
                  {category.generation}
                </span>
              </div>
              {/* 장르 */}
              <div className="flex items-center justify-center rounded-[4px] bg-Secondary-1 px-[8px] py-[2px]">
                <span className="body_2_2 text-White whitespace-nowrap">
                  {category.genre}
                </span>
              </div>
            </div>
          </div>

          {/* 별점 영역 (Frame 2087328716) */}
          <div className="flex flex-col items-start gap-[8px] self-stretch">
            <div className="flex items-center">{renderStars()}</div>
          </div>
        </div>

        {/* 책 소개 텍스트 */}
        <div className="flex flex-col self-stretch justify-center flex-1 text-Gray-5 body_1_3">
          {/* line-clamp 등으로 줄수 제한이 필요할 수도 있음 */}
          <p className="line-clamp-[4] whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    </div>
  );
}
