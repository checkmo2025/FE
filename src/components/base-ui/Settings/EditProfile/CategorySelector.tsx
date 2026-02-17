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

interface Props {
  selectedCategories?: string[]; // Enum string values from backend
  onToggle?: (category: string) => void;
}

export default function CategorySelector({
  selectedCategories = [],
  onToggle,
}: Props) {
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
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <div
              key={cat}
              onClick={() => onToggle?.(cat)}
              className={`flex items-center justify-center gap-[8px] rounded-[400px] border px-[16px] cursor-pointer transition-colors
                h-[36px] w-full md:h-[44px] md:w-[122px]
                ${isSelected
                  ? "border-primary-1 bg-primary-1"
                  : "border-Subbrown-3 bg-background hover:bg-white"
                }`}
            >
              <span
                className={`body_1_3 whitespace-nowrap ${isSelected ? "text-white" : "text-Gray-5"
                  }`}
              >
                {cat}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
