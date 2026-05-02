"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { NavItem } from "./NavItem";
import { useState, useRef, useEffect } from "react";
import SearchModal from "./SearchModal";

import NotificationDropdown from "./NotificationDropdown";
import { useNotificationPreviewQuery } from "@/hooks/queries/useNotificationQueries";
import { useHeaderTitle } from "@/contexts/HeaderTitleContext";
import { useAuthStore } from "@/store/useAuthStore";

import { useSearchStore } from "@/store/useSearchStore";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

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
  const router = useRouter();
  const defaultTitle = getPageTitle(pathname);
  const { customTitle } = useHeaderTitle();
  const { user, isLoggedIn, openLoginModal } = useAuthStore();
  const pageTitle = customTitle || defaultTitle;
  const { isSearchOpen, toggleSearch, closeSearch } = useSearchStore();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { data: notifications } = useNotificationPreviewQuery(5, isLoggedIn);
  const hasUnread = notifications?.some((notif) => !notif.read) ?? false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);


  const handleNavClick = (href: string, label: string) => {
    if (label === "모임" && !isLoggedIn) {
      openLoginModal();
      return;
    }
    router.push(href);
  };
  return (
    <header className="w-full bg-primary-1">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-3 t:px-6 t:py-3.5 d:px-5">
        <div className="relative flex items-center justify-between w-full">
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
                    onClick={() => handleNavClick(item.href, item.label)}
                  />
                );
              })}
            </nav>
          </div>

          {/* 모바일: 중앙 타이틀 표시 */}
          <span className="absolute text-base font-medium text-white -translate-x-1/2 left-1/2 t:hidden">
            {pageTitle}
          </span>

          {/*아이콘*/}
          <div className="flex items-center gap-2.5 t:gap-4 d:mr-1">
            <button
              onClick={toggleSearch}
              aria-label="검색"
              className="relative h-6 w-6 cursor-pointer"
            >
              <Image
                src="/search_light.svg"
                alt="검색"
                fill
                className="object-contain"
                priority
              />
            </button>

            <div className="relative flex items-center" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                aria-label="알림"
                className="relative w-6 h-6 cursor-pointer"
              >
                <Image
                  src="/notification.svg"
                  alt="알림"
                  fill
                  className="object-contain"
                  priority
                />
                {hasUnread && (
                  <span className="absolute top-0 right-0 block w-1.5 h-1.5 bg-Red rounded-full border border-primary-1" />
                )}
              </button>
              {isNotificationOpen && <NotificationDropdown />}
            </div>

            {/* 태블릿부터 프로필 표시 */}
            <Link
              href="/profile/mypage"
              aria-label="프로필"
              className="relative hidden w-6 h-6 t:block"
            >
              <Image
                src={user?.profileImageUrl || DEFAULT_PROFILE_IMAGE}
                alt="프로필"
                fill
                className={`object-cover ${user?.profileImageUrl ? "rounded-full" : "object-contain"}`}
                priority
              />
            </Link>
          </div>
        </div>
      </div>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </header>
  );
}
