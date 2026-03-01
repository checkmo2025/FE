"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type NewsListProps = {
  id?: number;
  imageUrl: string;
  title: string;
  content: string;
  date: string;
  className?: string;
};

export default function NewsList({
  id,
  imageUrl,
  title,
  content,
  date,
  className = "",
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
        "relative flex items-start",
        "w-[1040px] h-[185px] p-[20px]",
        "rounded-[8px] border border-Subbrown-4 bg-white",
        "justify-between gap-[122px]",
        id ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
        className,
      ].join(" ")}
    >
      {/* 좌측 그룹 */}
      <div className="flex flex-1 items-start gap-[24px] min-w-0">
        {/* 이미지 */}
        <div className="relative shrink-0 w-[100px] h-[145px]">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>

        {/* 텍스트 컬럼 */}
        <div className="flex flex-col items-start gap-[4px] min-w-0 w-auto">
          {/* 제목 */}
          <div className="flex h-[27px] flex-col items-start self-stretch justify-center">
            <h3 className="text-Black truncate w-full text-[20px] font-semibold leading-[145%] tracking-[-0.02em]">
              {title}
            </h3>
          </div>

          {/* 내용 */}
          <p className="text-Gray-4 line-clamp-4 w-full text-[14px] font-normal leading-[145%] tracking-[-0.014em]">
            {content}
          </p>
        </div>
      </div>

      {/* 우측 날짜 */}
      <div className="flex w-[79px] h-[20px] flex-col justify-center shrink-0 absolute right-[20px] top-[10px]">
        <span className="text-Gray-3 text-right text-[14px] font-normal leading-[145%] tracking-[-0.012em]">
          {date}
        </span>
      </div>
    </div>
  );
}