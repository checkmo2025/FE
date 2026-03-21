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
  coverImgSrc,
}: Props) {
  const imageSrc = coverImgSrc?.trim();

  return (
    <section className="w-full">
      <h1 className="text-Gray-7 font-semibold text-[18px] t:text-[22px] leading-[135%]">
        {name}
      </h1>

      <div className="mt-3 flex gap-6">
        <div className="relative w-[148px] h-[148px] t:w-[148px] t:h-[148px] rounded-md overflow-hidden bg-Gray-1 shrink-0">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${name} 커버`}
              fill
              className="object-cover"
              sizes="148px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-Gray-4 text-[14px]">
              이미지 없음
            </div>
          )}
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