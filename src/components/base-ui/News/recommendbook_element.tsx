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
      className={`relative flex ${sizeClasses} p-[12px] flex-col justify-end items-start gap-[10px] overflow-hidden ${
        onCardClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <Image
        src={coverSrc}
        alt={title}
        fill
        sizes={imageSizes}
        className="object-cover"
      />

      <div className="relative z-[1] flex flex-col items-start gap-[10px]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLikeChange(!liked);
          }}
          className="w-[24px] h-[24px] shrink-0"
        >
          <Image
            src={liked ? '/red_heart.svg' : '/gray_heart.svg'}
            alt=""
            width={24}
            height={24}
          />
        </button>

        <div className="flex flex-col items-start gap-[4px] min-w-0">
          <p className="text-[color:var(--White,#FFF)] _1 truncate">{title}</p>
          <p className="text-[color:var(--White,#FFF)] _4 truncate">{author}</p>
        </div>
      </div>
    </div>
  );
}
