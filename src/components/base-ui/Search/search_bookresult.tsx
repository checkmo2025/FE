'use client';
import Image from 'next/image';

type SearchBookResultProps = {
  imgUrl?: string; // 없으면 booksample.svg
  title: string;
  author: string;
  detail: string;

  liked: boolean;
  onLikeChange: (next: boolean) => void;

  onPencilClick?: () => void;
  onCardClick?: () => void;

  className?: string;
};

export default function SearchBookResult({
  imgUrl,
  title,
  author,
  detail,
  liked,
  onLikeChange,

  onPencilClick,
  onCardClick,

  className = '',
}: SearchBookResultProps) {
  const coverSrc = imgUrl && imgUrl.length > 0 ? imgUrl : '/booksample.svg';
  const clippedDetail =
    detail.length > 500 ? detail.slice(0, 500) + '...' : detail;

  return (
    <div
      onClick={onCardClick}
      className={[
        'relative flex w-full max-w-[1040px] p-[20px] justify-center items-start gap-6 rounded-[8px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-Subbrown-4',
        onCardClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      <div className="relative w-[126px] h-[183px] shrink-0">
        <Image
          src={coverSrc}
          alt={title}
          fill
          sizes="126px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 min-w-0 items-start gap-[24px]">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-Gray-7 subhead_3 truncate">
            {title}
          </p>
          <p className="text-Gray-4 t:subhead_4_1 truncate">
            {author}
          </p>

          <div className="h-[12px]" />

          <p className="flex1 h-full text-Gray-4 body_1_2 line-clamp-6">
            {clippedDetail}
          </p>
        </div>

        <div className="flex flex-col items-end shrink-0 ml-4">
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
        </div>
      </div>

      <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPencilClick?.();
            }}
            className="
              flex absolute bottom-[20px] right-[20px] w-12 h-12 t:w-15 t:h-15 px-[10px] py-[4.167px]
              flex-col justify-center items-center gap-[8.333px] shrink-0
              rounded-full bg-primary-2
            "
          >
            <Image src="/pencil_icon.svg" alt="" width={20} height={20} />
          </button>
    </div>
  );
}
