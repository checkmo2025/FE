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
      <h1 className="mb-[20px] subhead_2 text-Gray-7">
        {title}
      </h1>

      <div className="mb-6 w-full flex items-center gap-3">
        <div className={`relative ${inputWidthClassName}`}>
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder={placeholder}
            className="w-full h-[56px] rounded-[8px] border border-Subbrown-4 bg-White pl-4 pr-14 body_1_2 text-Gray-7 placeholder:text-Gray-4 focus:outline-none focus:ring-2 focus:ring-Subbrown-3"
          />
          <button
            type="button"
            onClick={onSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-Gray-1"
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