import React from "react";
import { INTEREST_CATEGORIES } from "./useProfileImage";

interface InterestCategorySelectorProps {
  selectedInterests: string[];
  onToggle: (category: string) => void;
}

const InterestCategorySelector: React.FC<InterestCategorySelectorProps> = ({
  selectedInterests,
  onToggle,
}) => {
  return (
    <div className="flex flex-col w-full gap-[16px]">
      <div className="flex flex-row items-center gap-[10px]">
        <span className="text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
          관심 카테고리
        </span>
        <div className="flex h-[27px] p-[10px] justify-center items-center gap-[10px]">
          <span className="text-[#8D8D8D] font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]">
            (최소 1개, 최대 6개 선택)
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-[12px]">
        {INTEREST_CATEGORIES.map((category) => {
          const isSelected = selectedInterests.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`w-[122px] h-[44px] flex justify-center items-center rounded-[400px] text-[14px] leading-[145%] tracking-[-0.014px] transition-colors ${
                isSelected
                  ? "bg-[#A19182] border border-[#D2C5B6] text-[#FFF] font-medium"
                  : "bg-[#F9F7F6] border border-[#D2C5B6] text-[#5C5C5C] font-normal"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestCategorySelector;
