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
    <div className="flex flex-col items-center gap-[10px] md:gap-[24px] w-full min-h-screen bg-[#F9F7F6] pb-[100px]">
      <ProfileBreadcrumb />

      <div className="mt-[12px] md:mt-[56px]">
        <ProfileUserInfo nickname={nickname} />
      </div>

      <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 gap-[24px] mt-[10px] md:mt-[72px]">
        <OtherUserProfileTabs />
      </div>
    </div>
  );
}
