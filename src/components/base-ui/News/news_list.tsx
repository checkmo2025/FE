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
        // 전체 컨테이너: 높이 자동(내부 콘텐츠 따름), 패딩 20px
        "flex w-full items-start p-[20px]",
        // 태블릿 이상에서 gap 적용 (명세의 122px은 공간 부족 시 자동 축소되도록 justify-between 권장되나, xl에서 적용)
        "justify-between gap-[12px] xl:gap-[122px]",
        "rounded-[8px] border border-Subbrown-4 bg-white",
        id ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
        className,
      ].join(" ")}
    >
      {/* [좌측 그룹] Frame 2087328004: 이미지 + 텍스트 */}
      <div className="flex flex-1 items-start gap-[24px] min-w-0">
        {/* 이미지: 100px x 145px (20:29 비율) */}
        <div className="relative w-[100px] h-[145px] shrink-0">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>

        {/* 텍스트 컬럼: Frame 2087327989 */}
        {/* 너비 316px (태블릿 기준) / 데스크탑에선 늘어날 수 있음 */}
        <div className="flex flex-col items-start gap-[8px] md:w-[316px] xl:w-auto min-w-0">
          {/* 제목 Wrapper: Frame 2087327988 */}
          <div className="flex h-[27px] flex-col items-start self-stretch justify-center">
            <h3 className="w-full truncate subhead_3 text-Black">{title}</h3>
          </div>

          {/* 내용: 너비 273px (명세 반영) */}
          <p className="body_1_2 text-Gray-4 line-clamp-6 w-full md:w-[273px] xl:w-full">
            {content}
          </p>
        </div>
      </div>

      {/* [우측] 날짜: 너비 79px */}
      <div className="flex w-[79px] h-[20px] flex-col justify-center shrink-0">
        <span className="text-right body_1_2 text-Gray-3">{date}</span>
      </div>
    </div>
  );
}
