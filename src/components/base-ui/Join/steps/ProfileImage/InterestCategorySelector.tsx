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
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-[10px]">
        {/* Title: Hidden on Mobile (shown in Header instead), Visible on Desktop */}
        <span className="hidden md:block text-primary-1 font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
          관심 카테고리
        </span>
        {/* Subtitle: Visible & Centered on Mobile */}
        <div className="flex h-[27px] p-[10px] justify-center items-center gap-[10px]">
          <span className="text-Gray-4 font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]">
            (최소 1개, 최대 6개 선택)
          </span>
        </div>
      </div>

      {/* Grid for Mobile (3 cols), Flex for Desktop */}
      <div className="grid grid-cols-3 gap-2 w-full md:flex md:flex-wrap md:gap-[12px]">
        {INTEREST_CATEGORIES.map((category) => {
          const isSelected = selectedInterests.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`w-full md:w-[122px] h-[44px] flex justify-center items-center rounded-[400px] text-[14px] leading-[145%] tracking-[-0.014px] transition-colors ${
                isSelected
                  ? "bg-Subbrown-1 border border-Subbrown-3 text-White font-medium"
                  : "bg-background border border-Subbrown-3 text-Gray-5 font-normal"
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
