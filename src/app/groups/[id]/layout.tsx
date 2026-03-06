"use client";

import { useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useClubhomeQueries } from "@/hooks/queries/useClubhomeQueries";

type TabType = "home" | "notice" | "bookcase";

export default function GroupDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const groupId = params.id as string;
  const groupIdNum = Number(groupId);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const skipLayout = useMemo(() => {
    return pathname?.includes("/admin/");
  }, [pathname]);

  const safeClubId = skipLayout ? NaN : groupIdNum;
  const { homeQuery } = useClubhomeQueries(safeClubId);

  if (skipLayout) return <>{children}</>;

  const groupName = homeQuery.data?.name ?? "";

  const getActiveTab = (): TabType => {
    if (pathname.includes("/notice")) return "notice";
    if (pathname.includes("/bookcase")) return "bookcase";
    return "home";
  };

  const activeTab = getActiveTab();

  const tabs = [
    { id: "home" as TabType, label: "모임 홈", href: `/groups/${groupId}`, icon: "/group_home.svg" },
    { id: "notice" as TabType, label: "공지사항", href: `/groups/${groupId}/notice`, icon: "/Notification2.svg" },
    { id: "bookcase" as TabType, label: "책장", href: `/groups/${groupId}/bookcase`, icon: "/bookshelf.svg" },
  ];

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="w-full t:h-21.5">
        <div className="mx-auto w-full max-w-[1440px] t:px-10 d:px-5">
          <div className="border-b-2 border-Subbrown-4 px-5 py-3 t:py-7">
            <h1 className="text-Gray-7 body_1 t:subhead_2">{groupName || "모임"}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] py-3 t:px-6 t:pt-3 t:pb-8">
        <div className="flex flex-col gap-6 t:gap-9 d:flex-row d:gap-8">
          <aside className="w-full px-3 t:mx-3 d:mx-0 shrink-0 d:w-[236px]">
            <nav className="flex w-full flex-row items-stretch gap-[7px] t:gap-[8px] d:flex-col d:gap-3 d:justify-start">
              <button
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className={`
                  flex shrink-0 items-center justify-center
                  rounded-lg
                  text-Gray-7
                  active:bg-transparent focus:outline-none
                  h-[40px] bg-primary-2
                  t:h-[48px]
                  d:h-auto d:bg-transparent d:px-4 d:py-4
                  pointer-events-none cursor-default
                  d:pointer-events-auto d:cursor-pointer
                  w-[47px] t:w-[56px]
                  ${isSidebarExpanded ? "d:w-full d:justify-start" : "d:w-fit d:justify-start"}
                `}
                aria-label={isSidebarExpanded ? "사이드바 접기" : "사이드바 펼치기"}
              >
                <div className="relative flex h-6 w-6 shrink-0 items-center justify-center t:h-5 t:w-5 d:h-7 d:w-7">
                  <div
                    className={`absolute inset-0 hidden rounded-lg d:block ${
                      isSidebarExpanded ? "bg-primary-2 -m-4" : ""
                    }`}
                  />
                  <div className="relative h-full w-full d:hidden">
                    <Image src="/after_category.svg" alt="토글" fill className="object-contain" />
                  </div>
                  <div className="relative hidden h-full w-full d:block">
                    <Image
                      src={isSidebarExpanded ? "/after_category.svg" : "/before_category.svg"}
                      alt="토글"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </button>

              <div className="flex w-full flex-1 flex-row gap-[7px] t:gap-[8px] d:flex-col d:gap-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`
                        flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2
                        t:gap-3 t:px-4 t:py-3
                        ${isActive ? "bg-Subbrown-4 text-Gray-7" : "bg-transparent text-Gray-7 hover:bg-Subbrown-4"}
                        h-[40px] min-w-0
                        t:h-[48px]
                        d:min-w-0
                        ${
                          isSidebarExpanded
                            ? "d:w-full d:flex-none d:justify-start d:h-auto d:py-4"
                            : "d:w-fit d:flex-none d:justify-center d:h-auto d:py-4"
                        }
                      `}
                    >
                      <div className="relative h-5 w-5 shrink-0 t:h-7 t:w-7">
                        <Image src={tab.icon} alt={tab.label} fill className="object-contain" />
                      </div>

                      <span className="whitespace-nowrap body_1_2 d:hidden">{tab.label}</span>

                      {isSidebarExpanded && (
                        <span className="hidden whitespace-nowrap body_1_2 t:subhead_4_1 d:inline">
                          {tab.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          <main className="min-w-0 flex-1 px-3">{children}</main>
        </div>
      </div>
    </div>
  );
}