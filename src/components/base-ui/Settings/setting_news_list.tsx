"use client";
import Image from "next/image";

type NewsListProps = {
  imageUrl: string;
  title: string;
  content: string;
  date: string; // "2025-10-09" 같은 문자열
  className?: string;
};

export default function Setting_NewsList({
  imageUrl,
  title,
  content,
  date,
  className = "",
}: NewsListProps) {
  return (
    <div
      className={[
        "inline-flex w-full max-w-[1000px] p-[20px] items-start",
        "rounded-[8px] border border-[color:var(--Subbrown_4,#EAE5E2)] bg-white gap-6",
        className,
      ].join(" ")}
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

      {/* middle + right */}
      <div className="flex flex-1 min-w-0 items-start">
        {/* middle text */}
        <div className="flex flex-col gap-[8px] min-w-0 flex-1">
          <p className="text-[#000] Subhead_3 truncate">{title}</p>
          <p className="text-[color:var(--Gray_4,#8D8D8D)] Body_1_2 line-clamp-6">
            {content}
          </p>
        </div>

        {/* 최소 120px 확보 + 날짜 오른쪽 고정 */}
        <div className="shrink-0 min-w-[180px] text-right">
          <p className="text-[color:var(--Gray_3,#BBB)] Body_1_2">{date}</p>
        </div>
      </div>
    </div>
  );
}
