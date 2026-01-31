// src/components/base-ui/Settings/EditProfile/CategorySelector.tsx
"use client";

const CATEGORIES = [
  "소설/시/희곡",
  "에세이",
  "인문학",
  "경영/경제",
  "자기계발",
  "사회과학",
  "역사",
  "예술/대중문화",
  "만화",
  "장르소설",
  "과학",
  "어린이/청소년",
  "여행",
  "요리",
  "기타",
];

export default function CategorySelector() {
  return (
    <div className="flex flex-col items-start gap-[28px] self-stretch">
      <div className="flex items-end gap-[9px] self-stretch">
        <span className="body_1_2 text-primary-3">관심 카테고리</span>
        <span className="body_1_2 text-Gray-3">(최소 1개, 최대 6개 선택)</span>
      </div>

      <div
        className="grid w-full grid-cols-3 gap-x-[10px] gap-y-[8px] 
        md:w-[386px] md:gap-y-[16px]
        xl:w-full xl:grid-cols-5"
      >
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="flex items-center justify-center gap-[8px] rounded-[400px] border border-Subbrown-3 bg-background px-[16px] cursor-pointer hover:bg-white
              h-[36px] w-full
              md:h-[44px] md:w-[122px]"
          >
            <span className="body_1_3 text-Gray-5 whitespace-nowrap">
              {cat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
