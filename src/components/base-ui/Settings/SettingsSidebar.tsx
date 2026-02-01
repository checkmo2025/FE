"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { SETTINGS_MENU } from "@/constants/setting/setting";
import SettingsMenuItem from "./Items/SettingsMenuItem";

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[180px] xl:w-[236px] shrink-0 flex-col items-start bg-transparent transition-all duration-300">
      {/* 사이드바 제목: 설정 */}
      <div className="flex items-center gap-[8px] self-stretch px-[20px] py-[28px]">
        <h2 className="text-center subhead_3 text-Gray-7">설정</h2>
      </div>

      {/* 메뉴 그룹 */}
      <nav className="flex flex-col items-start gap-[8px] self-stretch">
        {SETTINGS_MENU.map((group) => (
          <div
            key={group.category}
            className="flex flex-col items-start self-stretch"
          >
            {/* 카테고리 헤더: Frame 2087328519 */}
            {/* padding 12px 20px */}
            <div className="flex items-center gap-[8px] self-stretch px-[20px] py-[12px]">
              <div className="relative w-[24px] h-[24px]">
                <Image src={group.icon} alt="" fill />
              </div>
              <span className="body_1_2 text-Gray-7">{group.category}</span>
            </div>

            {/* 세부 메뉴 리스트 */}
            <div className="flex flex-col items-start gap-[2px] self-stretch">
              {group.items.map((item) => (
                <SettingsMenuItem
                  key={item.href}
                  label={item.label}
                  href={item.href}
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
