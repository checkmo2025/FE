"use client";

import Link from "next/link";

type Props = {
  label: string;
  href: string;
  isActive: boolean;
};

export default function SettingsMenuItem({ label, href, isActive }: Props) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-[10px] self-stretch rounded-[8px] px-[20px] py-[8px] transition-colors ${
        isActive ? "bg-[#D2C5B6]" : "bg-transparent hover:bg-gray-100"
      }`}
    >
      <span
        className={`text-[14px] leading-[145%] tracking-[-0.014px] ${
          isActive ? "font-medium text-[#434343]" : "font-normal text-[#8D8D8D]"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
