"use client";

import React from "react";

type CategoryDTO = {
  code?: string | number | null;
  description?: string | null;
};

type Props = {
  // ✅ number[] (기존) + DTO[] (신규) 둘 다 허용
  category: Array<number | CategoryDTO> | null | undefined;
  className?: string;
};

const LABEL: Record<number, string> = {
  1: "여행",
  2: "외국어",
  3: "어린이/청소년",
  4: "종교/철학",
  5: "소설/시/희곡",
  6: "에세이",
  7: "인문학",
  8: "과학",
  9: "컴퓨터/IT",
  10: "경제/경영",
  11: "자기계발",
  12: "사회과학",
  13: "정치/외교/국방",
  14: "역사/문화",
  15: "예술/대중문화",
};

const getBgByIndex = (idx: number) => {
  // 그냥 보기 좋은 정도로만 분산
  if (idx % 4 === 0) return "bg-Secondary-2";
  if (idx % 4 === 1) return "bg-Secondary-1";
  if (idx % 4 === 2) return "bg-Secondary-3";
  return "bg-Secondary-4";
};

const getBgByNumberCategory = (n: number) => {
  if (n >= 1 && n <= 4) return "bg-Secondary-2";
  if (n >= 5 && n <= 7) return "bg-Secondary-1";
  if (n >= 8 && n <= 11) return "bg-Secondary-3";
  if (n >= 12 && n <= 15) return "bg-Secondary-4";
  return "bg-Subbrown-4";
};

export default function ClubCategoryTags({ category, className }: Props) {
  const list = Array.isArray(category) ? category : [];

  // ✅ number[]로 들어온 경우 (기존)
  if (list.length > 0 && typeof list[0] === "number") {
    const nums = Array.from(new Set(list as number[]))
      .filter((n) => n >= 1 && n <= 15)
      .sort((a, b) => a - b);

    if (nums.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {nums.map((n) => {
          const label = LABEL[n] ?? `카테고리${n}`;
          const short = label.length <= 2;

          return (
            <span
              key={n}
              className={[
                "h-[21px] my-auto py-[1px] inline-flex items-center justify-center body_2_2",
                "rounded-[8px] text-White",
                short ? "w-[44px]" : "px-2",
                getBgByNumberCategory(n),
                className,
              ].join(" ")}
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  }

  // ✅ DTO[]로 들어온 경우 (신규): description 전부 보여줌
  const dtoList = list as CategoryDTO[];

  // code 기준 uniq (code 없으면 description 기준으로라도 uniq)
  const unique = Array.from(
    new Map(
      dtoList
        .map((c) => {
          const code = c?.code == null ? "" : String(c.code);
          const description = c?.description == null ? "" : String(c.description);
          return { code, description };
        })
        .filter((x) => (x.code || x.description).trim().length > 0)
        .map((x) => [x.code || x.description, x])
    ).values()
  );

  if (unique.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {unique.map((c, idx) => {
        const label = (c.description || c.code || "").trim();
        const short = label.length <= 2;

        return (
          <span
            key={`${c.code}-${idx}`}
            className={[
              "h-[21px] my-auto py-[1px] inline-flex items-center justify-center body_2_2",
              "rounded-[8px] text-White",
              short ? "w-[44px]" : "px-2",
              getBgByIndex(idx),
              className,
            ].join(" ")}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}