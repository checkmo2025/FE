"use client";

import Image from "next/image";
import BookshelfAdminMenu from "./bookid/BookshelfAdminMenu";


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

  isStaff?: boolean;
  isDeletingBookshelf?: boolean;
  onEditBookshelf?: () => void;
  onDeleteBookshelf?: () => void;
};

export default function BookDetailCard({
  imageUrl = "/dummy_book_cover.png",
  title,
  author,
  description,
  category,
  rating,

  isStaff = false,
  isDeletingBookshelf = false,
  onEditBookshelf,
  onDeleteBookshelf,
}: Props) {
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const isFull = i < Math.floor(rating);
      return (
        <div key={i} className="relative h-[18px] w-[18px] t:h-[24px] t:w-[24px]">
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
    <div className="flex items-start gap-[24px] self-stretch">
      {/* 왼쪽: 이미지 + (모바일에서 메뉴) */}
      <div className="flex flex-col items-start gap-[8px] shrink-0">
        <div className="relative h-[172px] w-[119px] t:h-[230px] t:w-[159px] shrink-0 bg-Gray-2 shadow-sm overflow-hidden rounded-[4px]">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>

        {/* ✅ 모바일에서: 이미지 아래 */}
        {isStaff && onEditBookshelf && onDeleteBookshelf && (
          <div className="t:hidden w-full ml-1.5">
            <BookshelfAdminMenu
              isDeleting={isDeletingBookshelf}
              onEdit={onEditBookshelf}
              onDelete={onDeleteBookshelf}
            />
          </div>
        )}
      </div>

      {/* 오른쪽: 텍스트 + (t 이상에서 메뉴는 제목 오른쪽) */}
      <div className="flex flex-1 min-w-0 flex-col items-start gap-[10px] t:gap-[20px]">
        <div className="flex w-full min-w-0 flex-col items-start gap-[10px] t:gap-[24px] flex-1">
          <div className="flex w-full min-w-0 flex-col items-start gap-[4px]">
            <div className="w-full min-w-0 t:flex t:items-start t:justify-between t:gap-[12px]">
              <p className="w-full min-w-0 body_1 text-Gray-7 line-clamp-[2] break-words">
                {title}
              </p>

              {/* ✅ t 이상에서: 제목 옆 오른쪽 끝 */}
              {isStaff && onEditBookshelf && onDeleteBookshelf && (
                <div className="hidden t:block shrink-0">
                  <BookshelfAdminMenu
                    isDeleting={isDeletingBookshelf}
                    onEdit={onEditBookshelf}
                    onDelete={onDeleteBookshelf}
                  />
                </div>
              )}
            </div>

            <span className="truncate w-full body_2_2 text-Gray-4">{author}</span>
          </div>

          <div className="flex items-center gap-[4px] self-stretch">
            <div className="flex items-center justify-center rounded-[4px] bg-primary-2 px-[8px] py-[2px]">
              <span className="body_2_2 text-White whitespace-nowrap">{category.generation}</span>
            </div>
            <div className="flex items-center justify-center rounded-[4px] bg-Secondary-1 px-[8px] py-[2px]">
              <span className="body_2_2 text-White whitespace-nowrap">{category.genre}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start self-stretch">
          <div className="flex items-center">{renderStars()}</div>
        </div>

        <div className="flex flex-col self-stretch justify-center flex-1 text-Gray-5 body_1_3 min-w-0">
          <p className="line-clamp-[4] body_2_3 whitespace-pre-wrap break-words">{description}</p>
        </div>
      </div>
    </div>
  );
}