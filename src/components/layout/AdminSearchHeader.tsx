"use client";

import Image from "next/image";
import React from "react";

type Props = {
  title: string;

  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;

  placeholder?: string;

  rightAddon?: React.ReactNode;

  /** width 커스텀 */
  inputWidthClassName?: string;
};

export default function AdminSearchHeader({
  title,
  keyword,
  onKeywordChange,
  onSearch,
  placeholder = "검색 하기",
  rightAddon,
  inputWidthClassName = "w-[1040px]",
}: Props) {
  return (
    <>
      <h1 className="mb-[20px] text-[#2C2C2C] text-[22px] font-semibold leading-[135%] tracking-[-0.022px]">
        {title}
      </h1>

      <div className="mb-6 w-full flex items-center gap-3">
        <div className={`relative ${inputWidthClassName}`}>
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder={placeholder}
            className="w-full h-[56px] rounded-[8px] border border-[#EAE5E2] bg-white pl-4 pr-14"
          />
          <button
            type="button"
            onClick={onSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-gray-100"
            aria-label="검색"
          >
            <Image src="/search.svg" alt="검색" width={24} height={24} />
          </button>
        </div>

        {/* 소식관리에서 버튼 추가 */}
        {rightAddon}
      </div>
    </>
  );
}