import React from "react";
import Image from "next/image";
import JoinHeader from "../../JoinHeader";
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
    <div className="relative flex flex-col items-center mx-auto w-full max-w-[766px] bg-white rounded-[8px] px-6 py-10 md:px-[40px] md:py-[60px] lg:px-[56px] lg:py-[99px]">
      <JoinHeader title="" />

      {/* Content Wrapper: Fluid width with responsive top margin */}
      <div className="flex flex-col items-center w-full max-w-[427px] mt-10 md:mt-[50px] lg:mt-[67px]">
        {/* 1. 텍스트 섹션 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-[#7B6154] font-sans text-[22px] md:text-[28px] lg:text-[32px] font-bold leading-[135%] tracking-[-0.032px]">
            회원이 되신 것을 환영합니다!
          </span>
          <span className="text-[#7B6154] font-sans text-[22px] md:text-[28px] lg:text-[32px] font-bold leading-[135%] tracking-[-0.032px]">
            참여중인 독서 모임이 있으신가요?
          </span>
        </div>

        {/* 2. 프로필 카드 섹션 */}
        <div className="flex flex-col items-center w-full max-w-[400px] h-auto py-8 mt-10 lg:mt-[66px] rounded-[8px] border border-[#D2C5B6] bg-[#F9F7F6]">
          <div className="w-[138px] h-[138px] rounded-full overflow-hidden border border-[#D2C5B6] bg-white">
            <Image
              src={profileImage}
              alt="Profile"
              width={138}
              height={138}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="mt-[30px] text-[#000] font-sans text-[20px] md:text-[24px] font-medium leading-[135%] text-center px-4 break-keep">
            {nickname}
          </span>
          <span className="mt-[20px] text-[#434343] font-sans text-[16px] md:text-[20px] font-normal leading-[140%] text-center px-4 break-keep">
            {intro}
          </span>
        </div>

        {/* 3. 버튼 그룹 섹션 */}
        <div className="flex flex-col w-full gap-[20px] mt-10 lg:mt-[60px]">
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
    </div>
  );
};

export default SignupComplete;
