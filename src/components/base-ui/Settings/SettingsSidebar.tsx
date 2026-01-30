"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { SETTINGS_MENU } from "@/constants/mocks/setting";
import SettingsMenuItem from "./Items/SettingsMenuItem";

export default function SettingsSidebar() {
  const pathname = usePathname(); // 현재 URL 경로 가져오기 (예: /setting/profile)

  return (
    <aside className="flex w-[236px] shrink-0 flex-col items-start bg-transparent">
      <div className="flex items-center gap-[8px] self-stretch px-[20px] py-[28px]">
        <h2 className="text-[20px] font-semibold leading-[135%] tracking-[-0.02px] text-[#2C2C2C]">
          설정
        </h2>
      </div>

      <nav className="flex flex-col items-start gap-[8px] self-stretch">
        {SETTINGS_MENU.map((group) => (
          <div
            key={group.category}
            className="flex flex-col items-start self-stretch"
          >
            <div className="flex items-center gap-[8px] self-stretch px-[20px] py-[12px]">
              <Image src={group.icon} alt="" width={24} height={24} />
              <span className="text-[14px] font-medium leading-[145%] tracking-[-0.014px] text-[#2C2C2C]">
                {group.category}
              </span>
            </div>

            <div className="flex flex-col items-start gap-[2px] self-stretch">
              {group.items.map((item) => (
                <SettingsMenuItem
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  // 현재 경로(pathname)와 아이템의 경로(item.href)가 같으면 isActive={true}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
