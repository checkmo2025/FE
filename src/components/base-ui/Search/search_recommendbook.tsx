'use client';

import Image from 'next/image';

type BookCoverCardProps = {
  imgUrl?: string;
  title: string;
  author: string;

  liked: boolean;
  onLikeChange: (next: boolean) => void;

  onCardClick?: () => void;
  className?: string;
};

export default function Search_BookCoverCard({
  imgUrl,
  title,
  author,
  liked,
  onLikeChange,
  onCardClick,
  className = '',
}: BookCoverCardProps) {
  const coverSrc = imgUrl && imgUrl.length > 0 ? imgUrl : '/booksample.svg';

  return (
    <div
      onClick={onCardClick}
      className={`flex flex-col items-start gap-3 ${onCardClick ? 'cursor-pointer' : ''
        } ${className}`}
    >
      {/* 도서 커버 이미지 영역 */}
      <div className="relative w-[111px] h-[144px] t:w-[217px] t:h-[286px] d:w-[332px] d:h-[436px] overflow-hidden rounded-lg shrink-0">
        <Image
          src={coverSrc}
          alt={title}
          fill
          sizes="(max-width: 767px) 111px, (max-width: 1439px) 217px, 332px"
          className="object-cover"
        />
      </div>

      {/* 정보 영역 (제목, 저자, 좋아요) */}
      <div className="flex items-start justify-between w-full pr-1">
        <div className="flex flex-col items-start min-w-0 pr-2">
          <p className="text-white subhead_4 t:subhead_1 truncate w-full">
            {title}
          </p>
          <p className="text-white/60 body_2_3 t:subhead_4 truncate w-full">
            {author}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLikeChange(!liked);
          }}
          className="w-6 h-6 shrink-0 mt-0.5"
        >
          <Image
            src={liked ? '/red_heart.svg' : '/gray_heart.svg'}
            alt="좋아요"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
