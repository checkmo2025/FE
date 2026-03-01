"use client";

import React, { useState } from "react";
import AdminUserProfile from "@/components/base-ui/Admin/users/AdminUserProfile";
import AdminCategory from "@/components/base-ui/Admin/users/AdminCategory";
import AdminUserTabs, {
  type AdminUserTabId,
} from "@/components/base-ui/Admin/users/AdminUserTab";

import MeetingList from "@/components/base-ui/Admin/users/MeetingList";
import BookStoryList from "@/components/base-ui/Admin/users/BookStoryList";
import NewsList from "@/components/base-ui/Admin/users/NewsList";
import ReportList from "@/components/base-ui/Admin/users/ReportList";

export default function Page() {
  const [activeTab, setActiveTab] = useState<AdminUserTabId>("meetings");

  // 더미
  // TODO: 관리자 사용자 상세 조회 API 연동 후, params.id 기반으로 user 데이터 교체 예정
  const user = {
    userId: "hy_0716",
    name: "윤현일",
    email: "yh9839@naver.com",
    phone: "010-1234-5678",
    intro:
      "이건 다양한 책을 읽고 서로의 생각을 나누는 책무새라서 시작했습니다. 한 권의 책이 주는 작은 울림이 일상에 변화를 만든다고 믿어요.",
    profileImage: null as string | null,
  };

  // TODO: 관리자 사용자 카테고리 조회 API 연동 후 params.id 기반으로 교체 예정
  const selectedCategories = [
    "KOREAN_NOVEL",
    "ESSAY",
    "HUMANITIES",
    "SELF_IMPROVEMENT",
  ];

  return (
    <main className="w-full bg-background">
      <section className="w-[1040px] mx-auto pt-[80px]">
        <div className="flex items-start justify-between gap-10">
          <div className="flex-1">
            <AdminUserProfile user={user} />
          </div>

          <aside className="w-[520px]">
            <AdminCategory selectedCategories={selectedCategories} />
          </aside>
        </div>

        <div className="flex flex-col items-center w-full gap-[40px] mt-[80px]">
          <AdminUserTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "meetings" && <MeetingList userId={user.userId} />}
          {activeTab === "stories" && <BookStoryList userId={user.userId} />}
          {activeTab === "posts" && <NewsList userId={user.userId} />}
          {activeTab === "reports" && <ReportList userId={user.userId} />}
        </div>
      </section>
    </main>
  );
}