"use client";

import { CATEGORIES } from "@/constants/categories";

interface Props {
  selectedCategories?: string[];
}

export default function AdminCategory({
  selectedCategories = [],
}: Props) {
  return (
    <div className="w-[526px]">
      {/* 4 x 4 grid */}
      <div className="grid grid-cols-4 gap-x-[12px] gap-y-[8px]">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.value);

          return (
            <div
              key={cat.value}
              className={`
                w-[122px] h-[44px]
                flex items-center justify-center gap-[8px]
                px-[16px] py-[12px]
                rounded-[400px]
                border border-Subbrown-3
                transition-colors
                ${isSelected ? "bg-Subbrown-1" : "bg-background"}
              `}
            >
              <span
                className={
                  isSelected
                    ? "body_1_2 text-white"
                    : "body_1_3 text-Gray-5"
                }
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