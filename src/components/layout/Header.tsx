"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NavItem } from "./NavItem";
import SearchModal from "./SearchModal";

const NAV = [
  { label: "책모 홈", href: "/" },
  { label: "모임", href: "/groups" },
  { label: "책 이야기", href: "/stories" },
  { label: "소식", href: "/news" },
];

// 현재 경로에 맞는 페이지 타이틀 반환
const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "책모 홈";
  if (pathname.startsWith("/groups")) return "모임";
  if (pathname.startsWith("/stories")) return "책 이야기";
  if (pathname.startsWith("/news")) return "소식";
  return "책모 홈";
};

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full bg-primary-1">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 t:px-6 t:py-7 d:px-3">
        <div className="relative flex w-full items-center justify-between">
          {/*로고 + 메뉴*/}
          <div className="flex items-center t:gap-2.5 d:gap-8">
            <Link
              href="/"
              className="relative w-[50px] h-[30px] t:w-14 t:h-[34px] overflow-hidden"
            >
              <Image
                src="/logo.svg"
                alt="책모 로고"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* 태블릿부터: 네비게이션 메뉴 */}
            <nav className="items-center hidden t:flex t:pl-[30px] d:pl-0">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    active={active}
                  />
                );
              })}
            </nav>
          </div>

          {/* 모바일: 중앙 타이틀 표시 */}
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-base t:hidden">
            {pageTitle}
          </span>

          {/*아이콘*/}
          <div className="flex items-center gap-2.5 t:gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="검색"
              className="relative h-6 w-6"
            >
              <Image
                src="/search_light.svg"
                alt="검색"
                fill
                className="object-contain"
                priority
              />
            </button>

            <Link
              href="/notification"
              aria-label="알림"
              className="relative h-6 w-6"
            >
              <Image
                src="/notification.svg"
                alt="알림"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* 태블릿부터 프로필 표시 */}
            <Link
              href="/profile"
              aria-label="프로필"
              className="relative h-6 w-6 hidden t:block"
            >
              <Image
                src="/profile.svg"
                alt="프로필"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>
        </div>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
