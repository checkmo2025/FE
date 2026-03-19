"use client";

import React from "react";

export const OTHER_PROFILE_TABS = [
  { id: "stories", label: "책 이야기" },
  { id: "library", label: "서재" },
  { id: "meetings", label: "모임" },
] as const;

export type OtherProfileTabId = (typeof OTHER_PROFILE_TABS)[number]["id"];

interface OtherUserProfileTabsProps {
  activeTab: OtherProfileTabId;
  onTabChange: (id: OtherProfileTabId) => void;
}

const OtherUserProfileTabs = ({ activeTab, onTabChange }: OtherUserProfileTabsProps) => {
  return (
    <div className="flex items-center w-full md:w-[768px] lg:w-[1440px] px-0 md:px-[60px] lg:px-[197px] border-b-2 border-[#DADADA]">
      {OTHER_PROFILE_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex justify-center items-center gap-[10px] p-[10px] text-[14px] font-medium md:text-[20px] md:font-semibold leading-[135%] tracking-[-0.02px] transition-colors ${
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

export default OtherUserProfileTabs;
