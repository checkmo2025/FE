"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type TabType = "home" | "notice" | "bookshelf";

export default function GroupDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const groupId = params.id as string;
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // 공지사항 작성 페이지, 책장 작성 페이지, 회원 관리 페이지는 레이아웃 적용 X
  if (pathname?.includes('/admin/notice/new') || pathname?.includes('/admin/bookcase') || pathname?.includes('/admin/members') || pathname?.includes('/admin/applicant')) {
    return <>{children}</>;
  }

  const isAdmin = pathname.includes("/admin");

  const getActiveTab = (): TabType => {
    if (isAdmin) {
      if (pathname.includes("/admin/notice")) return "notice";
      if (pathname.includes("/admin/bookcase")) return "bookshelf";
      return "home";
    }

    if (pathname.includes("/notice")) return "notice";
    if (pathname.includes("/bookcase")) return "bookshelf";
    return "home";
  };

  const activeTab = getActiveTab();

  // 더미 데이터
  const groupName = "긁적긁적 독서 모임";

  const tabs = isAdmin
    ? [
        {
          id: "home" as TabType,
          label: "모임 홈",
          href: `/groups/${groupId}/admin`,
          icon: "/group_home.svg",
        },
        {
          id: "notice" as TabType,
          label: "공지사항",
          href: `/groups/${groupId}/admin/notice`,
          icon: "/Notification2.svg",
        },
        {
          id: "bookshelf" as TabType,
          label: "책장",
          href: `/groups/${groupId}/admin/bookcase`,
          icon: "/bookshelf.svg",
        },
      ]
    : [
        {
          id: "home" as TabType,
          label: "모임 홈",
          href: `/groups/${groupId}`,
          icon: "/group_home.svg",
        },
        {
          id: "notice" as TabType,
          label: "공지사항",
          href: `/groups/${groupId}/notice`,
          icon: "/Notification2.svg",
        },
        {
          id: "bookshelf" as TabType,
          label: "책장",
          href: `/groups/${groupId}/bookcase`,
          icon: "/bookshelf.svg",
        },
      ];

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="w-full t:h-21.5">
        <div className="mx-auto w-full max-w-[1440px] t:px-10 d:px-5 ">
          <div className="px-5 py-3 border-b-2 border-Subbrown-4 t:py-7">
            <h1 className="text-Gray-7 body_1 t:subhead_2 ">{groupName}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 t:px-6 py-3 t:pt-3 t:pb-8">
        <div className="flex flex-col gap-6 t:gap-9 d:flex-row d:gap-8">
          {/* 사이드바 */}
          <aside className="shrink-0 w-full t:w-auto d:w-[236px]">
            <nav className="flex flex-row justify-center gap-[7px] t:gap-[8px] d:flex-col d:gap-3 d:justify-start t:mx-auto">
              {/* 카테고리 버튼 */}
              <button
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className={`
                  flex items-center justify-center
                  rounded-lg
                  text-Gray-7
                  active:bg-transparent focus:outline-none
                  w-[47px] h-[40px] bg-primary-2 t:w-[56px] t:h-[48px] d:w-fit d:h-auto d:px-4 d:py-4 d:bg-transparent
                  pointer-events-none d:pointer-events-auto cursor-default d:cursor-pointer
                  ${
                    isSidebarExpanded
                      ? "d:w-full d:justify-start"
                      : "d:w-fit d:justify-start"
                  }
                `}
                aria-label={
                  isSidebarExpanded ? "사이드바 접기" : "사이드바 펼치기"
                }
              >
                <div className="relative flex items-center justify-center w-6 h-6 t:w-6 t:h-6 d:w-8 d:h-8 shrink-0">
                  <div
                    className={`absolute inset-0 rounded-lg hidden d:block ${
                      isSidebarExpanded ? "bg-primary-2 -m-4" : ""
                    }`}
                  ></div>
                  {/* 모바일/태블릿: 항상 흰색 아이콘 */}
                  <div className="relative w-full h-full d:hidden">
                    <Image
                      src="/after_category.svg"
                      alt="토글"
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* 데스크탑: 상태에 따라 아이콘 변경 */}
                  <div className="relative w-full h-full hidden d:block">
                    <Image
                      src={
                        isSidebarExpanded
                          ? "/after_category.svg"
                          : "/before_category.svg"
                      }
                      alt="토글"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </button>

              {/* 메뉴들 */}
              <div className="flex flex-row gap-[7px] t:gap-[66px] d:flex-col d:gap-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`
                        flex items-center justify-center gap-1 t:gap-3
                        px-2 py-2 t:px-4 t:py-3 rounded-lg
                        ${
                          isActive
                            ? "bg-Subbrown-4 text-Gray-7"
                            : "bg-transparent text-Gray-7 hover:bg-Subbrown-4"
                        }
                        w-[90px] h-[40px] t:w-[164px] t:h-[48px]
                        ${
                          isSidebarExpanded
                            ? "d:w-full d:justify-start d:h-auto d:py-4"
                            : "d:w-fit d:justify-center d:h-auto d:py-4"
                        }
                      `}
                    >
                      <div className="relative w-6 h-6 t:w-8 t:h-8 shrink-0">
                        <Image
                          src={tab.icon}
                          alt={tab.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="whitespace-nowrap body_1_2 d:hidden">
                        {tab.label}
                      </span>
                      {isSidebarExpanded && (
                        <span className="hidden d:inline whitespace-nowrap body_1_2 t:subhead_4_1">
                          {tab.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* 오른쪽 영역 */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
