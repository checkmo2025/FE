import React from "react";
import Image from "next/image";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import { DUMMY_USER_PROFILE } from "@/constants/mocks/mypage";

const UserProfile = () => {
  const user = DUMMY_USER_PROFILE;

  return (
    <div className="flex flex-col items-start w-full max-w-[1440px] gap-[80px] px-4 md:px-[40px] lg:px-0">
      {/* Inner Content (Center Aligned) */}
      <div className="flex flex-col items-start w-full max-w-[734px] gap-[40px] mx-auto md:gap-[40px]">
        {/* Profile Info Area */}
        <div className="flex items-center self-stretch justify-between">
          {/* Profile Image */}
          <div className="flex justify-center items-center w-[138px] h-[138px] rounded-full bg-gray-200 overflow-hidden relative">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              // Placeholder UI (이미지가 없을 때)
              <div className="w-full h-full bg-[#EAE5E2]" />
            )}
          </div>

          {/* Text Info Wrapper */}
          <div className="flex flex-col items-center w-[558px] gap-[12px] rounded-[8px]">
            {/* Top Row: Name, Subscribers, Settings */}
            <div className="flex items-start self-stretch justify-between">
              {/* Left Side: Name & Subscription Info */}
              <div className="flex flex-col items-start gap-[8px] w-auto min-w-[136px]">
                <span className="text-[#2C2C2C] font-sans text-[24px] font-semibold leading-[135%] tracking-[-0.024px]">
                  {user.name}
                </span>
                <div className="flex items-center gap-[12px] self-stretch">
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[#8D8D8D] font-sans text-[18px] font-medium">
                      구독중
                    </span>
                    <span className="text-[#7B6154] font-sans text-[18px] font-medium">
                      {user.following}
                    </span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[#8D8D8D] font-sans text-[18px] font-medium">
                      구독자
                    </span>
                    <span className="text-[#7B6154] font-sans text-[18px] font-medium">
                      {user.subscribers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Edit Button & Settings */}
              <div className="flex items-center gap-[8px]">
                <button
                  type="button"
                  className="flex items-center justify-center"
                >
                  <Image
                    src="/mypage_button.svg"
                    alt="프로필 편집"
                    width={144}
                    height={48}
                    className="object-contain"
                  />
                </button>
                <button className="flex items-center justify-center w-[24px] h-[24px]">
                  <Image
                    src="/Setting_icon.svg"
                    alt="Settings"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>

            {/* Introduction */}
            <div className="flex flex-col items-start gap-[12px] w-[558px] self-stretch text-[#8D8D8D] font-sans text-[14px] font-medium leading-[145%]">
              {user.intro}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-[24px] self-stretch">
          <JoinButton className="w-[355px] h-[48px] p-[12px_16px] gap-[10px] rounded-[8px] bg-[#7B6154] text-[#FFF] font-sans text-[18px] font-medium leading-[135%]">
            내 책 이야기 쓰기
          </JoinButton>
          <JoinButton className="w-[355px] h-[48px] p-[12px_16px] gap-[10px] rounded-[8px] bg-[#7B6154] text-[#FFF] font-sans text-[18px] font-medium leading-[135%]">
            소식 문의하기
          </JoinButton>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
