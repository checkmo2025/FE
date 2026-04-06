"use client";

import React, { useEffect, useState } from "react";
import AdminUserProfile from "@/components/base-ui/Admin/users/AdminUserProfile";
import AdminCategory from "@/components/base-ui/Admin/users/AdminCategory";
import AdminUserTabs, {
  type AdminUserTabId,
} from "@/components/base-ui/Admin/users/AdminUserTab";
import MeetingList from "@/components/base-ui/Admin/users/MeetingList";
import BookStoryList from "@/components/base-ui/Admin/users/BookStoryList";
import NewsList from "@/components/base-ui/Admin/users/NewsList";
import ReportList from "@/components/base-ui/Admin/users/ReportList";
import {
  fetchAdminMemberDetail,
  type AdminMemberDetailResult,
} from "@/lib/api/admin/member";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const { id } = React.use(params);

  const [activeTab, setActiveTab] = useState<AdminUserTabId>("meetings");
  const [member, setMember] = useState<AdminMemberDetailResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemberDetail = async () => {
      try {
        setLoading(true);
        const res = await fetchAdminMemberDetail(id);
        setMember(res.result);
      } catch (error) {
        console.error("회원 상세 조회 실패:", error);
        setMember(null);
      } finally {
        setLoading(false);
      }
    };

    loadMemberDetail();
  }, [id]);

  if (loading) {
    return (
      <main className="w-full bg-background">
        <section className="w-[1040px] mx-auto pt-[80px]">
          <div>불러오는 중...</div>
        </section>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="w-full bg-background">
        <section className="w-[1040px] mx-auto pt-[80px]">
          <div>멤버 상세보기 불러오기 실패</div>
        </section>
      </main>
    );
  }

  const user = {
    userId: member.memberId,
    name: member.name,
    email: member.email,
    phone: member.phoneNumber,
    intro: member.description,
    profileImage: member.profileImageUrl || null,
  };

  const selectedCategories = member.categories ?? [];

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

          {activeTab === "meetings" && (
            <MeetingList memberNickname={member.nickname} />
          )}
          {activeTab === "stories" && (
            <BookStoryList memberNickname={member.nickname} />
          )}
          {activeTab === "posts" && <NewsList memberNickname={member.nickname} />}
          {activeTab === "reports" && (
            <ReportList memberNickname={member.nickname} />
          )}
        </div>
      </section>
    </main>
  );
}