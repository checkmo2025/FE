// src/app/profile/[nickname]/page.tsx
import Header from "@/components/layout/Header";
import OtherUserProfileTabs from "@/components/base-ui/Profile/OtherUser/OtherUserProfileTabs";
import ProfileBreadcrumb from "@/components/base-ui/Profile/OtherUser/ProfileBreadcrumb";
import ProfileUserInfo from "@/components/base-ui/Profile/OtherUser/ProfileUserInfo";

type PageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function OtherUserProfilePage({ params }: PageProps) {
  const { nickname } = await params;

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#F9F7F6]">
      <div className="flex flex-col items-center gap-[24px] self-stretch">
        {/* 1. 헤더 (모바일/PC 공통) */}
        <Header />

        {/* 2. 메인 콘텐츠 */}
        <div
          className="flex w-full max-w-[1440px] flex-col items-start 
          /* 모바일 gap 24px / 데스크탑 gap 80px */
          gap-[24px] md:gap-[80px] 
          /* 모바일 패딩 없음 (Breadcrumb full width) / 데스크탑 패딩 있음 */
          px-0 md:px-6 xl:px-3"
        >
          {/* 목차 */}
          <ProfileBreadcrumb />

          {/* 프로필 정보 + 탭 영역 */}
          {/* 모바일에서는 중앙 정렬 및 여백 조정 */}
          <section className="flex w-full flex-col items-center gap-[24px] md:gap-[72px] pb-[100px]">
            <ProfileUserInfo nickname={nickname} />
            <OtherUserProfileTabs />
          </section>
        </div>
      </div>
    </main>
  );
}
