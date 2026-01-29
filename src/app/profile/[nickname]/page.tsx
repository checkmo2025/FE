// src/app/profile/[nickname]/page.tsx
import Header from "@/components/layout/Header";
import Image from "next/image";
import OtherUserProfileTabs from "@/components/base-ui/Profile/OtherUser/OtherUserProfileTabs";
import ProfileBreadcrumb from "@/components/base-ui/Profile/OtherUser/ProfileBreadcrumb";
import ProfileUserInfo from "@/components/base-ui/Profile/OtherUser/ProfileUserInfo";

type PageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function OtherUserProfilePage({ params }: PageProps) {
  const { nickname } = await params;

  return (
    <main className="flex min-h-screen w-full flex-col items-start gap-[80px] bg-white">
      {/* 상단 헤더 및 네비게이션 영역 */}
      <div className="flex flex-col items-center gap-[24px] self-stretch">
        <Header />
        <ProfileBreadcrumb />
      </div>

      {/* 메인 콘텐츠 영역 (프로필 정보 + 탭) */}
      <section className="flex flex-col items-center gap-[72px] self-stretch pb-[100px]">
        <ProfileUserInfo nickname={nickname} />
        <OtherUserProfileTabs />
      </section>
    </main>
  );
}
