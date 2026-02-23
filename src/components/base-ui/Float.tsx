"use client";

import Image from "next/image";
import React from "react";

type FloatingFabProps = {
  iconSrc?: string; // 예: "/icons/pencil_white.svg"
  iconAlt?: string; // 접근성/aria용
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string; // 추가 커스텀
  iconClassName?: string; // 아이콘 추가 커스텀
  type?: "button" | "submit" | "reset";
};

export default function FloatingFab({
  iconSrc = "/add_story.svg",
  iconAlt = "플로팅 버튼",
  onClick,
  className = "",
  iconClassName = "",
  type = "button",
}: FloatingFabProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={iconAlt}
      className={[
        "fixed right-[18px] bottom-[82px] t:right-[43px] t:bottom-[54px] z-[60]",
        "flex flex-col items-center justify-center gap-[10px]",
        "w-[48px] h-[48px] t:w-[72px] t:h-[72px]",
        "rounded-[100px] bg-primary-2 px-3 py-[5px]",
        "shadow-[4px_4px_8px_0_rgba(0,0,0,0.16)]",

        "cursor-pointer",
        "active:-translate-y-[6px] active:brightness-95",
        "hover:brightness-90",
        className,
      ].join(" ")}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={24}
        height={24}
        className={["w-[24px] h-[24px] object-contain", iconClassName].join(
          " "
        )}
      />
    </button>
  );
}
