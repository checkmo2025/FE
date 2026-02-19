import React from "react";
import JoinLayout from "../../JoinLayout";
import JoinButton from "../../JoinButton";
import JoinInput from "../../JoinInput";
import { useProfileSetup } from "./useProfileSetup";
import { useSignup } from "@/contexts/SignupContext";

interface ProfileSetupProps {
  onNext?: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onNext }) => {
  const {
    nickname,
    isNicknameChecked,
    isNicknameValid,
    intro,
    name,
    phone,
    handleNicknameChange,
    handleIntroChange,
    handleNameChange,
    handlePhoneChange,
    handleCheckDuplicate,
    isValid,
  } = useProfileSetup();
  const { showToast } = useSignup();
  const nicknameRef = React.useRef<HTMLDivElement>(null);

  const handleNextClick = () => {
    if (!isNicknameChecked) {
      showToast("닉네임 중복확인을 해주세요!");
      nicknameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (isValid) {
      onNext?.();
    }
  };

  return (
    <JoinLayout title="프로필 설정">
      <div className="flex flex-col items-center w-full gap-[20px] t:gap-[100px]">
        {/* Form Container */}
        <div className="flex flex-col w-[272px] t:w-[526px] gap-[20px] t:gap-[36px]">
          {/* Group 1: Nickname & Intro */}
          <div className="flex flex-col gap-[16px]">
            {/* 닉네임 섹션 */}
            <div ref={nicknameRef} className="flex flex-col w-full gap-[12px]">
              <span className="text-primary-1 font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px] t:text-[20px] t:leading-[135%] t:tracking-[-0.02px]">
                닉네임
              </span>
              <div className="flex flex-row items-center justify-between w-full gap-[8px]">
                <div className="w-[158px] t:flex-1">
                  {/* Mobile Input */}
                  <div className="block w-full t:hidden">
                    <JoinInput
                      value={nickname}
                      onChange={handleNicknameChange}
                      placeholder="(최대 20자)"
                      className="h-[36px] py-0 border-Subbrown-4 placeholder-Gray-3 text-[14px] font-normal w-full bg-white"
                    />
                  </div>
                  {/* Desktop Input */}
                  <div className="hidden w-full t:block">
                    <JoinInput
                      value={nickname}
                      onChange={handleNicknameChange}
                      placeholder="닉네임을 입력해주세요(최대 20글자)"
                      className="h-[44px] border-Subbrown-4 placeholder-Gray-3 text-[14px] font-normal w-full bg-white"
                    />
                  </div>
                </div>
                <JoinButton
                  onClick={handleCheckDuplicate}
                  disabled={!isNicknameValid || isNicknameChecked}
                  variant={isNicknameValid ? "primary" : "secondary"}
                  className={`w-[106px] h-[36px] t:h-[44px] px-0 py-0 text-[14px] shrink-0 ${isNicknameChecked ? "font-medium" : "font-normal"
                    }`}
                >
                  {isNicknameChecked ? "확인됨" : "중복확인"}
                </JoinButton>
              </div>
            </div>
            {/* 한줄소개 */}
            <div className="flex flex-col w-full gap-[12px]">
              <span className="text-primary-1 font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px] t:text-[20px] t:leading-[135%] t:tracking-[-0.02px]">
                소개
              </span>
              <JoinInput
                value={intro}
                onChange={handleIntroChange}
                placeholder="40자 이내로 작성해주세요"
                className="h-[36px] t:h-[44px] py-0 t:py-[12px] border-Subbrown-4 placeholder-Gray-3 text-[14px] font-normal bg-white"
              />
            </div>
          </div>

          {/* Group 2: Name & Phone */}
          <div className="flex flex-col gap-[36px]">
            {/* 이름 */}
            <div className="flex flex-col w-full gap-[12px]">
              <span className="text-primary-1 font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px] t:text-[20px] t:leading-[135%] t:tracking-[-0.02px]">
                이름
              </span>
              <JoinInput
                value={name}
                onChange={handleNameChange}
                placeholder="이름을 입력해주세요"
                className="h-[36px] t:h-[44px] py-0 t:py-[12px] border-Subbrown-4 placeholder-Gray-3 text-[14px] font-normal bg-white"
              />
            </div>

            {/* 전화번호 */}
            <div className="flex flex-col w-full gap-[12px]">
              <span className="text-primary-1 font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px] t:text-[20px] t:leading-[135%] t:tracking-[-0.02px]">
                전화번호
              </span>
              <JoinInput
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                className="h-[36px] t:h-[44px] py-0 t:py-[12px] border-Subbrown-4 placeholder-Gray-3 text-[14px] font-normal bg-white"
              />
            </div>
          </div>

          <JoinButton
            onClick={handleNextClick}
            disabled={nickname === "" || intro === "" || name === "" || phone === ""}
            className="w-[272px] t:w-[526px]"
          >
            다음
          </JoinButton>
        </div>
      </div>
    </JoinLayout>
  );
};

export default ProfileSetup;
