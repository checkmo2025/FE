"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";
import { NavItem } from "./AdminNavItem";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useClickOutside } from "@/hooks/useClickOutside";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  // 외부 클릭 시 닫기
  useClickOutside(dropdownRef, () => setOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  const handleLogout = async () => {
    setOpen(false);
    await authService.logout();
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary-1">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-3 t:px-6 t:py-3.5 d:px-5">
        <div className="relative flex items-center justify-between w-full">

          {/* 로고 + 메뉴 */}
          <div className="flex items-center t:gap-2.5 d:gap-8">
            <div ref={mobileMenuRef} className="relative t:hidden">
              <button
                type="button"
                aria-label="관리자 메뉴"
                aria-expanded={mobileMenuOpen}
                aria-haspopup="menu"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-8 w-8 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[6px] hover:bg-white/10"
              >
                <span className="h-0.5 w-5 bg-white" />
                <span className="h-0.5 w-5 bg-white" />
                <span className="h-0.5 w-5 bg-white" />
              </button>

              {mobileMenuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-[calc(100%+10px)] w-[200px] overflow-hidden rounded-[8px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                >
                  {ADMIN_NAV.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 body_2 transition-colors hover:bg-gray-50 ${
                          active
                            ? "bg-Subbrown-5 text-primary-1"
                            : "text-Gray-7"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/admin/users"
              className="relative hidden h-[30px] w-[50px] overflow-hidden t:block t:h-[34px] t:w-14"
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

          {/* 홈 이동 + 프로필 드롭다운 */}
          <div ref={dropdownRef} className="relative flex items-center gap-2.5 t:gap-4 d:mr-1">
            <Link
              href="/home"
              aria-label="홈화면 가기"
              className="flex h-8 items-center justify-center rounded-[8px] border border-white px-2 text-xs font-medium text-white transition-colors hover:bg-white/10 t:h-9 t:px-3 t:body_2"
            >
              <span className="t:hidden">홈</span>
              <span className="hidden t:inline">홈화면 가기</span>
            </Link>

            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="관리자 프로필"
              aria-expanded={open}
              aria-haspopup="true"
              className="relative w-6 h-6 cursor-pointer"
            >
              <Image
                src={user?.profileImageUrl || DEFAULT_PROFILE_IMAGE}
                alt="프로필"
                fill
                className={`object-cover ${user?.profileImageUrl ? "rounded-full" : "object-contain"}`}
                priority
              />
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[140px] rounded-[8px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden z-50">
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
