"use client";

import React from "react";

export type Tab = "topic" | "review" | "meeting";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TABS: Tab[] = ["topic", "review", "meeting"];

const TAB_LABEL: Record<Tab, string> = {
  topic: "발제",
  review: "한줄평",
  meeting: "정기모임",
};

export default function BookDetailNav({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex w-full items-end border-b-2 border-Gray-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              flex w-full t:w-[115px] items-center justify-center gap-[10px] p-[10px] transition-colors
              border-b-2 hover:brightness-80 cursor-pointer
              mb-[-2px]
              ${isActive ? "border-primary-3 text-primary-3" : "border-Gray-3 text-Gray-3"}
            `}
          >
            <span className="subhead_4_1">{TAB_LABEL[tab]}</span>
          </button>
        );
      })}
    </div>
  );
}
