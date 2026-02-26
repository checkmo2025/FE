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
  responsive?: boolean; // 모바일/태블릿 반응형 여부
};

export default function BookCoverCard({
  imgUrl,
  title,
  author,
  liked,
  onLikeChange,
  onCardClick,
  className = '',
  responsive = false,
}: BookCoverCardProps) {
  const coverSrc = imgUrl && imgUrl.length > 0 ? imgUrl : '/booksample.svg';

  const sizeClasses = responsive
    ? 'w-[157px] h-[206px]'
    : 'w-61 h-80';

  const imageSizes = responsive ? '(max-width: 768px) 156px, 160px' : '244px';

  return (
    <div
      onClick={onCardClick}
      className={`flex flex-col items-start gap-3 ${onCardClick ? 'cursor-pointer' : ''
        } ${className}`}
    >
      {/* 도서 커버 이미지 영역 */}
      <div className={`relative ${sizeClasses} overflow-hidden rounded-lg shrink-0`}>
        <Image
          src={coverSrc}
          alt={title}
          fill
          sizes={imageSizes}
          className="object-cover"
        />
      </div>

      {/* 정보 영역 (제목, 저자, 좋아요) */}
      <div className="flex items-start justify-between w-full pr-1">
        <div className="flex flex-col items-start min-w-0 pr-2">
          <p className="text-Gray-7 subhead_2 truncate w-full">{title}</p>
          <p className="text-Gray-5 body_2 truncate w-full">{author}</p>
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
