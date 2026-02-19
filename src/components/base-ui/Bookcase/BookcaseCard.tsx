"use client";

import Image from "next/image";

type Props = {
  imageUrl?: string;
  title: string;
  author: string;
  category: {
    generation: string; // 예: "7기"
    genre: string; // 예: "소설/시/희곡"
  };
  rating: number; // 0 ~ 5
  onTopicClick?: () => void;
  onReviewClick?: () => void;
  onMeetingClick?: () => void;
};

export default function BookcaseCard({
  imageUrl = "/dummy_book_cover.png",
  title,
  author,
  category,
  rating,
  onTopicClick,
  onReviewClick,
  onMeetingClick,
}: Props) {
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
    // 1. 카드 컨테이너
    <div
      className="flex flex-col items-center justify-center gap-[16px] rounded-[8px] border border-Subbrown-4 bg-White p-[20px]
      w-[166px] t:w-[200px]"
    >
      {/* 2. 이미지 영역 */}
      <div
        className="relative shrink-0 bg-Gray-2 shadow-sm
        w-[146px] h-[166px]
        t:w-[159px] t:h-[230px]"
      >
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* 3. 정보 및 액션 영역 */}
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        {/* 책 정보 */}
        <div className="flex w-[115px] flex-col items-start gap-[4px]">
          <div className="flex w-[61px] flex-col items-start">
            <span className="self-stretch truncate body_1 text-Gray-7">
              {title}
            </span>
            <span className="self-stretch truncate body_2_2 text-Gray-4">
              {author}
            </span>
          </div>

          <div className="flex items-center gap-[4px] self-stretch">
            <div className="flex items-center justify-center rounded-[4px] bg-primary-2 px-[8px] py-[2px]">
              <span className="body_2_2 text-White whitespace-nowrap">
                {category.generation}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-[4px] bg-Secondary-1 px-[8px] py-[2px]">
              <span className="body_2_2 text-White whitespace-nowrap truncate max-w-[80px]">
                {category.genre}
              </span>
            </div>
          </div>
        </div>

        {/* 액션 리스트 및 별점 */}
        <div className="flex flex-col items-start gap-[8px] self-stretch">
          <div className="flex flex-col items-start self-stretch ">
            {[
              { label: "발제", onClick: onTopicClick },
              { label: "한줄평", onClick: onReviewClick },
              { label: "정기모임", onClick: onMeetingClick },
            ]
              .filter((item) => item.onClick)
              .map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center justify-between self-stretch border-b border-Subbrown-4 p-[4px] hover:bg-Gray-1 transition-colors cursor-pointer"
                >
                  <span className="body_2_2 text-Gray-7">{item.label}</span>
                  <div className="relative h-[24px] w-[24px]">
                    <Image src="/bookcase_arrow.svg" alt="arrow" fill />
                  </div>
                </button>
              ))}
          </div>

          <div className="flex items-center">{renderStars()}</div>
        </div>
      </div>
    </div>
  );
}
