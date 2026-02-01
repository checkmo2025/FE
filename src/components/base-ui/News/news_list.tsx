"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        "relative flex w-full items-start p-[20px]",
        "rounded-[8px] border border-Subbrown-4 bg-white",
        "justify-between gap-[12px] xl:gap-[122px]",
        id ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
        className,
      ].join(" ")}
    >
      {/* [좌측 그룹] 이미지 + 텍스트 */}
      <div className="flex flex-1 items-start gap-[24px] min-w-0">
        {/* 이미지 */}
        <div
          className="relative shrink-0 
          w-[80px] h-[116px] 
          md:w-[100px] md:h-[145px]"
        >
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>

        {/* 텍스트 컬럼 */}
        <div
          className="flex flex-col items-start gap-[4px] min-w-0
          w-[173px] md:w-[316px] xl:w-auto"
        >
          {/* 제목 Wrapper */}
          <div className="flex h-[27px] flex-col items-start self-stretch justify-center">
            {/* 모바일 14px(Body_1) / 태블릿이상 20px(Subhead_3) */}
            <h3
              className="text-Black truncate w-full
              text-[14px] font-semibold leading-[145%] tracking-[-0.014px]
              md:subhead_3"
            >
              {title}
            </h3>
          </div>

          {/* 내용 */}
          {/* 모바일 12px(Body_2.3) / 태블릿이상 14px(Body_1.2) */}
          <p
            className="text-Gray-4 line-clamp-4 md:line-clamp-6 w-full
            text-[12px] font-normal leading-[145%] tracking-[-0.012px]
            md:body_1_2 md:w-[273px] xl:w-full"
          >
            {content}
          </p>
        </div>
      </div>

      {/* [우측] 날짜 */}
      {/* 모바일: absolute right-5 bottom-2.5 */}
      {/* 태블릿이상: static block */}
      <div
        className="flex w-[79px] h-[20px] flex-col justify-center shrink-0
        absolute right-[20px] bottom-[10px]
        md:static"
      >
        <span
          className="text-Gray-3 text-right
          text-[12px] font-normal leading-[145%] tracking-[-0.012px]
          md:body_1_2"
        >
          {date}
        </span>
      </div>
    </div>
  );
}
