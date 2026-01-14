"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "책모 홈",
    href: "/",
    iconBefore: "/before_home.svg",
    iconAfter: "/after_home.svg",
  },
  {
    label: "모임",
    href: "/groups",
    iconBefore: "/before_group.svg",
    iconAfter: "/after_group.svg",
  },
  {
    label: "책 이야기",
    href: "/stories",
    iconBefore: "/before_story.svg",
    iconAfter: "/after_story.svg",
  },
  {
    label: "소식",
    href: "/news",
    iconBefore: "/before_news.svg",
    iconAfter: "/after_news.svg",
  },
  {
    label: "마이페이지",
    href: "/mypage",
    iconBefore: "/before_my.svg",
    iconAfter: "/after_my.svg",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-White border-t border-Gray-2 t:hidden">
      <div className="flex items-center justify-around h-[70px] px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 py-2 "
            >
              <div className="relative w-12 h-12">
                <Image
                  src={isActive ? item.iconAfter : item.iconBefore}
                  alt={item.label}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
