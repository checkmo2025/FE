"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SETTINGS_MENU } from "@/constants/setting/setting";

export default function SettingsPage() {
  const router = useRouter();

  // 데스크탑(xl, 1280px 이상)에서는 설정 진입 시 '프로필 편집'으로 리다이렉트
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        router.replace("/setting/profile");
      }
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  return (
    // 모바일 전용 뷰
    <div className="flex w-full flex-col items-center pt-[10px] xl:hidden">
      {/* 메뉴 리스트 컨테이너 (width: 339px) */}
      <div className="flex w-[339px] flex-col items-start gap-[8px]">
        {SETTINGS_MENU.map((group) => (
          <div
            key={group.category}
            className="flex flex-col items-start gap-[8px] self-stretch"
          >
            {/* 카테고리 헤더 (Frame 2087328519) */}
            <div className="flex items-center gap-[8px] self-stretch px-[20px] py-[12px]">
              <div className="relative h-[24px] w-[24px]">
                <Image src={group.icon} alt="" fill />
              </div>
              <span className="body_1_2 text-Gray-7">{group.category}</span>
            </div>

            {/* 세부 메뉴 리스트 (Frame 2087328520) */}
            <div className="flex flex-col items-start gap-[2px] self-stretch">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-[10px] rounded-[8px] px-[20px] py-[8px] self-stretch transition-colors hover:bg-Gray-1"
                >
                  <span className="body_1_3 text-Gray-4">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
