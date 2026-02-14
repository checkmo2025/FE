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
      className={`relative flex w-[111px] h-[144px] t:w-[217px] t:h-[286px] d:w-[332px] d:h-[436px] p-[16px] flex-col justify-end items-start gap-[12px] overflow-hidden ${
        onCardClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <Image
        src={coverSrc}
        alt={title}
        fill
        sizes="(max-width: 767px) 111px, (max-width: 1439px) 217px, 332px"
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

        <div className="flex flex-col items-start gap-[6px] min-w-0">
          <p className="text-white subhead_4 t:subhead_1 truncate">
            {title}
          </p>
          <p className="text-white body_2_3 t:subhead_4 truncate">
            {author}
          </p>
        </div>
      </div>
    </div>
  );
}
