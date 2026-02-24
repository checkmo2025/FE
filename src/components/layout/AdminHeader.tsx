"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NavItem } from "./AdminNavItem";

const ADMIN_NAV = [
  { label: "회원 관리", href: "/admin/users" },
  { label: "모임 관리", href: "/admin/groups" },
  { label: "책 이야기 관리", href: "/admin/stories" },
  { label: "소식 관리", href: "/admin/news" },
];

// 관리자: 현재 경로에 맞는 타이틀
const getAdminPageTitle = (pathname: string) => {
  if (pathname.startsWith("/admin/users")) return "회원 관리";
  if (pathname.startsWith("/admin/groups")) return "모임 관리";
  if (pathname.startsWith("/admin/stories")) return "책 이야기 관리";
  if (pathname.startsWith("/admin/news")) return "소식 관리";
  return "관리자";
};

export default function AdminHeader() {
  const pathname = usePathname();
  const pageTitle = getAdminPageTitle(pathname);

  return (
    <header className="w-full bg-primary-1">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-3 t:px-6 t:py-3.5 d:px-5">
        <div className="relative flex items-center justify-between w-full">
          {/* 로고 + 메뉴 */}
          <div className="flex items-center t:gap-2.5 d:gap-8">
            <Link
              href="/admin/users"
              className="relative w-[50px] h-[30px] t:w-14 t:h-[34px] overflow-hidden"
              aria-label="관리자 홈"
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
              {ADMIN_NAV.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");

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
          <span className="absolute text-base font-medium text-white -translate-x-1/2 left-1/2 t:hidden">
            {pageTitle}
          </span>

          {/* 아이콘 */}
          <div className="flex items-center gap-2.5 t:gap-4 d:mr-1">
            <Link
              href="/admin/profile"
              aria-label="관리자 프로필"
              className="relative w-6 h-6"
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
    </header>
  );
}