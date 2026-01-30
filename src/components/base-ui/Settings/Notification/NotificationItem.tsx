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
    // 추후 API 연동 시 여기에 로직 추가
  };

  return (
    <div className="flex items-start gap-[38px]">
      {/* 토글 스위치 */}
      <button
        type="button"
        onClick={handleToggle}
        className={`flex h-[28px] w-[56px] items-center rounded-[17.5px] p-[3.5px] transition-colors ${
          isChecked ? "bg-primary-2 justify-end" : "bg-Gray-3 justify-start"
        }`}
      >
        <div className="h-[22.75px] w-[22.75px] rounded-full bg-White shadow-sm" />
      </button>

      {/* 텍스트 정보 */}
      <div className="flex w-[432px] flex-col items-start gap-[4px]">
        <h4 className="body_1_2 text-Gray-7">{title}</h4>
        <p className="body_1_3 text-Gray-4">{description}</p>
      </div>
    </div>
  );
}
