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
    <main className="flex flex-col items-center w-full min-h-screen bg-background">
     

      {/* 2. 메인 컨텐츠 래퍼 */}
      <div
        className="flex w-full max-w-screen-d flex-col items-start 
        gap-[24px] t:gap-[80px] 
        px-0 t:px-6 d:px-3"
      >
        {/* 목차 (Breadcrumb) */}
        <ProfileBreadcrumb />

        {/* 프로필 정보 및 탭 섹션 */}
        <section className="flex w-full flex-col items-center gap-[24px] t:gap-[72px] pb-[100px]">
          <ProfileUserInfo nickname={nickname} />
          <OtherUserProfileTabs />
        </section>
      </div>
    </main>
  );
}
