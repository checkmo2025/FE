'use client';

import React from 'react';

type Props = {
  category: number[]; // 1~15
  className?: string;
};

const LABEL: Record<number, string> = {
  1: '여행',
  2: '외국어',
  3: '어린이/청소년',
  4: '종교/철학',
  5: '소설/시/희곡',
  6: '에세이',
  7: '인문학',
  8: '과학',
  9: '컴퓨터/IT',
  10: '경제/경영',
  11: '자기계발',
  12: '사회과학',
  13: '정치/외교/국방',
  14: '역사/문화',
  15: '예술/대중문화',
};

const getBgByCategory = (n: number) => {
  if (n >= 1 && n <= 4) return 'bg-Secondary-2';
  if (n >= 5 && n <= 7) return 'bg-Secondary-1';
  if (n >= 8 && n <= 11) return 'bg-Secondary-3';
  if (n >= 12 && n <= 15) return 'bg-Secondary-4'; 
  return 'bg-Subbrown-4';
};

export default function ClubCategoryTags({ category, className }: Props) {
  const nums = Array.from(new Set(category))
    .filter((n) => n >= 1 && n <= 15)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-wrap gap-3">
      {nums.map((n) => {
        const label = LABEL[n] ?? `카테고리${n}`;
        const short = label.length <= 2;

        return (
          <span
            key={n}
            className={[
              'h-[21px] inline-flex items-center justify-center body_1_2',
              'rounded-[8px] text-White',
              short ? 'w-[44px]' : 'px-2',
              getBgByCategory(n),
              className,
            ].join(' ')}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
