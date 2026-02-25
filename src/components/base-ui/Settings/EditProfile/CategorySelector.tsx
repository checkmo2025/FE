// src/components/base-ui/Settings/EditProfile/CategorySelector.tsx
"use client";

const CATEGORIES = [
  { label: "소설/시/희곡", value: "FICTION_POETRY_DRAMA" },
  { label: "에세이", value: "ESSAY" },
  { label: "인문학", value: "HUMANITIES" },
  { label: "경영/경제", value: "ECONOMY_MANAGEMENT" },
  { label: "자기계발", value: "SELF_DEVELOPMENT" },
  { label: "사회과학", value: "SOCIAL_SCIENCE" },
  { label: "역사", value: "HISTORY_CULTURE" },
  { label: "예술/대중문화", value: "ART_POP_CULTURE" },
  { label: "만화", value: "COMIC" },
  { label: "장르소설", value: "GENRE_FICTION" },
  { label: "과학", value: "SCIENCE" },
  { label: "어린이/청소년", value: "CHILDREN_BOOKS" },
  { label: "여행", value: "TRAVEL" },
  { label: "요리", value: "COOKING" },
  { label: "기타", value: "OTHER" },
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
          const isSelected = selectedCategories.includes(cat.value);
          return (
            <div
              key={cat.value}
              onClick={() => onToggle?.(cat.value)}
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
                {cat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
