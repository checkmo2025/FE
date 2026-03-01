"use client";

import React from "react";

export type AdminUserTabId = "meetings" | "stories" | "posts" | "reports";

const USER_TABS: Array<{ id: AdminUserTabId; label: string }> = [
  { id: "meetings", label: "가입 모임" },
  { id: "stories", label: "책 이야기" },
  { id: "posts", label: "등록 소식" },
  { id: "reports", label: "신고 목록" },
];

interface AdminUserTabsProps {
  activeTab: AdminUserTabId;
  onTabChange: (id: AdminUserTabId) => void;
}

const AdminUserTabs = ({ activeTab, onTabChange }: AdminUserTabsProps) => {
  return (
    <div className="flex items-center w-full md:w-[768px] lg:w-[1440px] px-0 md:px-[60px] lg:px-[197px] border-b-2 border-Gray-2">
      {USER_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex justify-center items-center gap-[10px] p-[10px]
            body_1_2 md:subhead_3
            transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-primary-3 border-primary-3 -mb-[2px]"
                : "text-Gray-3 border-transparent"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AdminUserTabs;