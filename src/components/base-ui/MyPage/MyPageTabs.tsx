"use client";

import React from "react";

const TABS = [
  { id: "stories", label: "내 책 이야기" },
  { id: "library", label: "내 서재" },
  { id: "meetings", label: "내 모임" },
  { id: "notifications", label: "내 알림" },
];

interface MyPageTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}
const MyPageTabs = ({ activeTab, onTabChange }: MyPageTabsProps) => {
  return (
    <div className="flex items-center w-full max-w-[1440px] px-[197px] border-b-2 border-[#DADADA]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex justify-center items-center gap-[10px] p-[10px] text-[20px] font-semibold leading-[135%] tracking-[-0.02px] transition-colors ${
            activeTab === tab.id
              ? "text-[#5E4A40] border-b-2 border-[#5E4A40] -mb-[2px]"
              : "text-[#BBB] border-b-2 border-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MyPageTabs;
