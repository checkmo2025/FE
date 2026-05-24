"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { NavItem } from "./AdminNavItem";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { authService } from "@/services/authService";

const ADMIN_NAV = [
  { label: "회원 관리", href: "/admin/users" },
  { label: "모임 관리", href: "/admin/groups" },
  { label: "책 이야기 관리", href: "/admin/stories" },
  { label: "소식 관리", href: "/admin/news" },
];

const getAdminPageTitle = (pathname: string) => {
  const item = ADMIN_NAV.find((n) =>
    pathname === n.href || pathname.startsWith(n.href + "/")
  );
  return item?.label ?? "관리자";
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getAdminPageTitle(pathname);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await authService.logout();
    router.replace("/");
  };

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
                alt="책모"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* 태블릿부터: 네비게이션 메뉴 */}
            <nav className="items-center hidden t:flex t:pl-[30px] d:pl-0">
              {ADMIN_NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

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

          {/* 프로필 드롭다운 */}
          <div ref={dropdownRef} className="relative flex items-center gap-2.5 t:gap-4 d:mr-1">
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="관리자 프로필"
              className="relative w-6 h-6 cursor-pointer"
            >
              <Image
                src={DEFAULT_PROFILE_IMAGE}
                alt="프로필"
                fill
                className="object-contain"
                priority
              />
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[140px] rounded-[8px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden z-50">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block w-full px-4 py-3 text-left body_2 text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  홈화면 가기
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-left body_2 text-red-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
