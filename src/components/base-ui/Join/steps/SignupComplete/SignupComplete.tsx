import React from "react";
import Image from "next/image";
import JoinLayout from "../../JoinLayout";
import JoinButton from "../../JoinButton";
import { useSignupComplete } from "./useSignupComplete";

const SignupComplete: React.FC = () => {
  const {
    nickname,
    intro,
    profileImage,
    handleSearchMeeting,
    handleCreateMeeting,
    handleUseWithoutMeeting,
  } = useSignupComplete();

  return (
    <JoinLayout title="" desktopGap="t:gap-[60px]">
      <div className="flex flex-col items-center w-[272px] t:w-[526px] gap-[24px] t:gap-[60px]">
        {/* 1. 텍스트 섹션 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-primary-1 font-sans text-[18px] t:text-[32px] font-bold leading-[135%] tracking-[-0.032px]">
            회원이 되신 것을 환영합니다!
          </span>
          <span className="text-primary-1 font-sans text-[18px] t:text-[32px] font-bold leading-[135%] tracking-[-0.032px]">
            참여중인 독서 모임이 있으신가요?
          </span>
        </div>

        {/* 2. 프로필 카드 섹션 */}
        <div className="flex flex-col items-center w-full max-w-[400px] h-auto py-[20px] t:py-8 rounded-[8px] border border-Subbrown-3 bg-background">
          <div className="w-[100px] h-[100px] t:w-[138px] t:h-[138px] rounded-full overflow-hidden border border-Subbrown-3 bg-white">
            <Image
              src={profileImage}
              alt="Profile"
              width={138}
              height={138}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="mt-[16px] t:mt-[30px] text-Black font-sans text-[18px] t:text-[24px] font-medium leading-[135%] text-center px-4 break-keep">
            {nickname}
          </span>
          <span className="mt-[12px] t:mt-[20px] text-Gray-6 font-sans text-[14px] t:text-[20px] font-normal leading-[140%] text-center px-4 break-keep">
            {intro}
          </span>
        </div>

        {/* 3. 버튼 그룹 섹션 */}
        <div className="flex flex-col w-full gap-[12px] t:gap-[20px]">
          <JoinButton onClick={handleSearchMeeting} className="w-full">
            모임 검색하기
          </JoinButton>
          <JoinButton onClick={handleCreateMeeting} className="w-full">
            모임 생성하기
          </JoinButton>
          <JoinButton onClick={handleUseWithoutMeeting} className="w-full">
            모임 없이 이용하기
          </JoinButton>
        </div>
      </div>
    </JoinLayout>
  );
};

export default SignupComplete;
