"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NavItem } from "./NavItem";

const NAV = [
  { label: "책모 홈", href: "/" },
  { label: "모임", href: "/groups" },
  { label: "책 이야기", href: "/stories" },
  { label: "소식", href: "/news" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#7B6154]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-7">
        <div className="flex w-full items-center justify-between">
          {/*로고 + 메뉴*/}
          <div className="flex items-center gap-8">
            <Link href="/" className="relative h-8 w-14 ml-2 overflow-hidden">
              <Image
                src="/logo.svg"
                alt="책모 로고"
                fill
                className="object-contain"
                priority
              />
            </Link>

            <nav className="flex items-center">
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

          {/*아이콘*/}
          <div className="flex items-center gap-4">
            <Link href="/search" aria-label="검색" className="relative h-6 w-6">
              <Image
                src="/search.svg"
                alt="검색"
                fill
                className="object-contain"
                priority
              />
            </Link>

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

            <Link
              href="/profile"
              aria-label="프로필"
              className="relative h-6 w-6"
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
