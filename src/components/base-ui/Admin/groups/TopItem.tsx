"use client";

import Image from "next/image";

type Props = {
  groupId: string | number;
  name: string;
  intro?: string;
  coverImgSrc?: string;
};

export default function GroupTopSection({
  name,
  intro,
  coverImgSrc = "/group_cover_placeholder.svg",
}: Props) {
  return (
    <section className="w-full">
      {/* 타이틀 */}
      <h1 className="text-Gray-7 font-semibold text-[18px] t:text-[22px] leading-[135%]">
        {name}
      </h1>

      {/* 커버 + 소개 */}
      <div className="mt-3 flex gap-6">
        <div className="relative w-[148px] h-[148px] t:w-[148px] t:h-[148px] rounded-md overflow-hidden bg-Gray-1 shrink-0">
          <Image
            src={coverImgSrc}
            alt={`${name} 커버`}
            fill
            className="object-cover"
            sizes="148px"
          />
        </div>

        <div className="flex-1 rounded-[8px] border border-Subbrown-4 bg-White px-4 py-3">
          <p className="text-Gray-4 text-[14px] mb-2">모임 소개</p>
          <p className="text-Gray-7 text-[14px] whitespace-pre-wrap">
            {intro?.trim() ? intro : "소개가 아직 없어요."}
          </p>
        </div>
      </div>
    </section>
  );
}