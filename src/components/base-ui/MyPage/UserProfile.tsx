import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import { DUMMY_USER_PROFILE } from "@/constants/mocks/mypage";
import { useProfileQuery, useFollowCountQuery } from "@/hooks/queries/useMemberQueries";
import FloatingFab from "../Float";
import { EXTERNAL_LINKS } from "@/constants/links";

const UserProfile = () => {
  const router = useRouter();
  const { data: profileData } = useProfileQuery();
  const { data: followCountData } = useFollowCountQuery();

  // 서버 데이터가 있으면 사용하고, 없으면 더미 데이터 사용
  const user = {
    ...DUMMY_USER_PROFILE,
    name: profileData?.nickname || DUMMY_USER_PROFILE.name,
    intro: profileData?.description || DUMMY_USER_PROFILE.intro,
    profileImage: profileData?.profileImageUrl || DUMMY_USER_PROFILE.profileImage,
    following: followCountData?.followingCount ?? 0,
    subscribers: followCountData?.followerCount ?? 0,
  };

  const [settingsHref, setSettingsHref] = React.useState("/setting/profile");

  React.useEffect(() => {
    const handleResize = () => {
      // t: "768px" 가 tailwind.config.js 에 정의되어 있음
      if (window.innerWidth < 768) {
        setSettingsHref("/setting");
      } else {
        setSettingsHref("/setting/profile");
      }
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-start w-full max-w-[1440px] gap-[24px] md:gap-[80px] px-[18px] md:px-[40px] lg:px-0 mx-auto">
      {/* Inner Content (Center Aligned) */}
      <div className="flex flex-col items-start w-full max-w-[734px] gap-[24px] md:gap-[40px] mx-auto">
        {/* Profile Info Area */}
        <div className="relative flex items-center self-stretch justify-between">
          {/* Profile Image */}
          <div className="flex justify-center items-center w-[138px] h-[138px] rounded-full bg-gray-200 overflow-hidden relative shrink-0">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              // Placeholder UI
              <div className="w-full h-full bg-[#EAE5E2]" />
            )}
          </div>

          {/* Text Info Wrapper */}
          <div className="flex flex-col items-center w-full md:w-[558px] gap-[12px] rounded-[8px] pl-[20px] md:pl-0">
            {/* Top Row: Name, Subscribers, Settings */}
            <div className="flex items-start self-stretch justify-between">
              {/* Left Side: Name & Subscription Info */}
              <div className="flex flex-col items-start gap-[8px] w-auto min-w-[136px]">
                <span className="text-[#2C2C2C] font-sans text-[24px] font-semibold leading-[135%] tracking-[-0.024px]">
                  {user.name}
                </span>
                <div className="flex items-center gap-[12px] self-stretch">
                  <Link href="/profile/mypage/follows?tab=following" className="flex items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-[#8D8D8D] font-sans text-[18px] font-medium">
                      구독중
                    </span>
                    <span className="text-[#7B6154] font-sans text-[18px] font-medium">
                      {user.following}
                    </span>
                  </Link>
                  <Link href="/profile/mypage/follows?tab=follower" className="flex items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-[#8D8D8D] font-sans text-[18px] font-medium">
                      구독자
                    </span>
                    <span className="text-[#7B6154] font-sans text-[18px] font-medium">
                      {user.subscribers}
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Side: Edit Button & Settings */}
              <div className="flex items-center gap-[8px]">
                {/* Edit Button: Hidden on Mobile, Block on Tablet+ */}
                <button
                  type="button"
                  className="items-center justify-center hidden md:flex"
                >
                  <Image
                    src="/mypage_button.svg"
                    alt="프로필 편집"
                    width={144}
                    height={48}
                    className="object-contain"
                  />
                </button>
                {/* Settings Icon: Absolute on Mobile, Static on Tablet+ */}
                <Link
                  href={settingsHref}
                  className="absolute right-0 top-0 md:static flex items-center justify-center w-[24px] h-[24px]"
                >
                  <Image
                    src="/Setting_icon.svg"
                    alt="Settings"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </div>

            {/* Introduction */}
            <div className="gap-[12px] w-full self-stretch text-[#8D8D8D] font-sans text-[14px] font-medium leading-[145%] line-clamp-3 md:line-clamp-none">
              {user.intro}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-[12px] md:gap-[24px] self-stretch">
          <JoinButton
            onClick={() => router.push("/stories/new")}
            className="w-[160px] h-[32px] md:w-[355px] md:h-[48px] p-[12px_16px] gap-[10px] rounded-[8px] font-sans text-[14px] font-semibold md:text-[18px] md:font-medium leading-[135%]"
          >
            내 책 이야기 쓰기
          </JoinButton>
          <JoinButton
            onClick={() => window.open(EXTERNAL_LINKS.INQUIRY_FORM_URL, "_blank")}
            className="w-[160px] h-[32px] md:w-[355px] md:h-[48px] p-[12px_16px] gap-[10px] rounded-[8px] font-sans text-[14px] font-semibold md:text-[18px] md:font-medium leading-[135%]"
          >
            소식 문의하기
          </JoinButton>
        </div>
        <FloatingFab
          iconSrc="/icons_pencil.svg"
          iconAlt="글쓰기"
          onClick={() => router.push("/stories/new")}
        />
      </div>
    </div>
  );
};

export default UserProfile;
