import React from "react";
import Image from "next/image";
import JoinHeader from "../../JoinHeader";
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
    <div className="relative flex flex-col items-center w-[766px] px-[56px] py-[99px] bg-white rounded-[8px]">
      <JoinHeader title="" />

      <div className="flex flex-col items-center w-[427px] mt-[67px]">
        {/* 1. 텍스트 섹션 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-[#7B6154] font-sans text-[32px] font-bold leading-[135%] tracking-[-0.032px]">
            회원이 되신 것을 환영합니다!
          </span>
          <span className="text-[#7B6154] font-sans text-[32px] font-bold leading-[135%] tracking-[-0.032px]">
            참여중인 독서 모임이 있으신가요?
          </span>
        </div>

        {/* 2. 프로필 카드 섹션 */}
        <div className="flex flex-col items-center w-[400px] h-[276px] mt-[66px] rounded-[8px] border border-[#D2C5B6] bg-[#F9F7F6]">
          <div className="mt-[24px] w-[138px] h-[138px] rounded-full overflow-hidden border border-[#D2C5B6] bg-white">
            <Image
              src={profileImage}
              alt="Profile"
              width={138}
              height={138}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="mt-[30px] text-[#000] font-sans text-[24px] font-medium leading-[20px]">
            {nickname}
          </span>
          <span className="mt-[20px] text-[#434343] font-sans text-[20px] font-normal leading-[20px]">
            {intro}
          </span>
        </div>

        {/* 3. 버튼 그룹 섹션 */}
        <div className="flex flex-col w-full gap-[20px] mt-[60px]">
          <button
            onClick={handleSearchMeeting}
            className="w-full h-[48px] px-[16px] py-[12px] rounded-[8px] bg-[#7B6154] text-[#FFF] font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]"
          >
            모임 검색하기
          </button>
          <button
            onClick={handleCreateMeeting}
            className="w-full h-[48px] px-[16px] py-[12px] rounded-[8px] bg-[#7B6154] text-[#FFF] font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]"
          >
            모임 생성하기
          </button>
          <button
            onClick={handleUseWithoutMeeting}
            className="w-full h-[48px] px-[16px] py-[12px] rounded-[8px] bg-[#7B6154] text-[#FFF] font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]"
          >
            모임 없이 이용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupComplete;
