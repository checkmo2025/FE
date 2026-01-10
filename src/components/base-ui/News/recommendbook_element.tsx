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

export default function BookCoverCard({
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
      className={`relative flex w-[244px] h-[320px] p-[12px] flex-col justify-end items-start gap-[10px] overflow-hidden ${
        onCardClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <Image
        src={coverSrc}
        alt={title}
        fill
        sizes="244px"
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
