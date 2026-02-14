"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
  initialChecked?: boolean;
};

export default function NotificationItem({
  title,
  description,
  initialChecked = true,
}: Props) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    // 전체 아이템 컨테이너
    <div className="flex items-start gap-[38px] self-stretch">
      <button
        type="button"
        onClick={handleToggle}
        className={`flex h-[28px] w-[56px] shrink-0 items-center rounded-[17.5px] p-[3.5px] transition-colors ${
          isChecked ? "bg-primary-2 justify-end" : "bg-Gray-3 justify-start"
        }`}
      >
        <div className="h-[22.75px] w-[22.75px] rounded-full bg-White shadow-sm" />
      </button>

      {/* 텍스트 정보 */}
      <div className="flex flex-1 flex-col items-start gap-[4px] min-w-0">
        <h4 className="body_1_2 text-Gray-7">{title}</h4>
        <p className="body_1_3 text-Gray-4 break-keep">{description}</p>
      </div>
    </div>
  );
}
