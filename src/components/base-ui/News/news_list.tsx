'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type NewsListProps = {
  id?: number;
  imageUrl: string;
  title: string;
  content: string;
  date: string; // "2025-10-09" 같은 문자열
  className?: string;
};

export default function NewsList({
  id,
  imageUrl,
  title,
  content,
  date,
  className = '',
}: NewsListProps) {
  const router = useRouter();

  const handleClick = () => {
    if (id) {
      router.push(`/news/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={[
        'inline-flex w-full max-w-[1040px] p-[20px] items-start',
        'rounded-[8px] border border-[color:var(--Subbrown_4,#EAE5E2)] bg-white gap-6',
        id ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
        className,
      ].join(' ')}
    >
      {/* left image */}
      <div className="relative w-[100px] h-[145px] shrink-0 ">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="100px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col t:flex-row flex-1 min-w-0 items-start t:items-start">
        <div className="flex flex-col gap-[8px] min-w-0 flex-1">
          <p className="text-[#000] subhead_3 truncate">{title}</p>
          <p className="text-[color:var(--Gray_4,#8D8D8D)] body_1_2 line-clamp-6">
            {content}
          </p>
        </div>

        {/* 날짜 - 모바일: 아래 오른쪽, 태블릿 이상: 오른쪽 */}
        <div className="shrink-0 w-full t:w-auto t:min-w-[180px] mt-7 t:mt-0 text-right">
          <p className="text-[color:var(--Gray_3,#BBB)] body_1_2">{date}</p>
        </div>
      </div>
    </div>
  );
}
