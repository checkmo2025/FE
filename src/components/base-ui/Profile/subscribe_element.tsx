"use client";

import React from "react";
import Image from "next/image";

type SubscribeProps = {
  name: string;
  isSubscribed: boolean;
  onToggleSubscribe?: (next: boolean) => void;

  profileSrc?: string; // default: /profile4.svg
  className?: string;
};

export default function Subscribe({
  name,
  isSubscribed,
  onToggleSubscribe,
  profileSrc = "/profile4.svg",
  className = "",
}: SubscribeProps) {
  return (
    <div
      className={[
        "flex w-full max-w-[1040px] p-[20px] justify-between items-center",
        "rounded-[8px] border border-[color:var(--Subbrown_4,#EAE5E2)] bg-[color:var(--White,#FFF)]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-[12px] min-w-0">
        <div className="relative w-[40px] h-[40px] shrink-0 rounded-full overflow-hidden">
          <Image src={profileSrc} alt={name} fill sizes="40px" className="object-cover" />
        </div>

        <p className="text-[color:var(--Gray_7,#2C2C2C)] Subhead_4_1 truncate">{name}</p>
      </div>

      <button
        type="button"
        onClick={() => onToggleSubscribe?.(!isSubscribed)}
        className={`
          flex px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] shrink-0
          text-[12px] font-semibold leading-[100%] tracking-[-0.012px]
          ${
            isSubscribed
              ? "border border-[color:var(--Subbrown_4,#EAE5E2)] bg-[color:var(--White,#FFF)] text-[color:var(--Gray_4,#8D8D8D)]"
              : "bg-[color:var(--primary_2,#9A7A6B)] text-[color:var(--White,#FFF)]"
          }
        `}
      >
        {isSubscribed ? "구독중" : "구독"}
      </button>
    </div>
  );
}
