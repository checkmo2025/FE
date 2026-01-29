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
      {/* 요청하신 CSS 적용 영역: 
        Header와 하단 콘텐츠(Breadcrumb 포함) 사이의 간격을 24px로 설정 
      */}
      <div className="flex flex-col items-center gap-[24px] self-stretch">
        {/* 1. 헤더 */}
        <Header />

        {/* 2. 메인 콘텐츠 (Breadcrumb + 프로필 + 탭) */}
        {/* Header와 이 div 사이에 24px gap이 생깁니다. */}
        <div className="flex w-full max-w-[1440px] flex-col items-start gap-[80px] px-4 md:px-6 xl:px-3">
          {/* 목차 (Breadcrumb) */}
          {/* ProfileBreadcrumb는 w-full을 가지므로 부모 padding(md:px-6)에 맞춰 정렬됩니다. */}
          <ProfileBreadcrumb />

          {/* 프로필 정보 + 탭 영역 */}
          <section className="flex w-full flex-col items-center gap-[72px] pb-[100px]">
            <ProfileUserInfo nickname={nickname} />
            <OtherUserProfileTabs />
          </section>
        </div>
      </div>
    </main>
  );
}
