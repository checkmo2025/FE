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
      <Header />

      <div className="flex w-full max-w-[1440px] flex-col items-start gap-[80px] px-4 md:px-6 xl:px-3">
        <div className="flex w-full flex-col items-center gap-[24px]">
          <ProfileBreadcrumb />
        </div>

        <section className="flex w-full flex-col items-center gap-[72px] pb-[100px]">
          <ProfileUserInfo nickname={nickname} />
          <OtherUserProfileTabs />
        </section>
      </div>
    </main>
  );
}
