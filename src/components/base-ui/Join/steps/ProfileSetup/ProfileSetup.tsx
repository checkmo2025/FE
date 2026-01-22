import React from "react";
import JoinHeader from "../../JoinHeader";
import JoinButton from "../../JoinButton";
import JoinInput from "../../JoinInput";
import { useProfileSetup } from "./useProfileSetup";

interface ProfileSetupProps {
  onNext?: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onNext }) => {
  const {
    nickname,
    isNicknameChecked,
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

  return (
    <div className="relative flex flex-col items-center w-[766px] px-[56px] py-[99px] bg-white rounded-[8px]">
      <JoinHeader title="프로필 설정" />

      <div className="flex flex-col w-full mt-[120px] mb-[92px]">
        <div className="flex flex-col items-start w-[526px] gap-[36px] mx-auto">
          {/* 닉네임 섹션 (Custom Layout) */}
          <div className="flex flex-col w-full gap-[12px]">
            <span className="text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
              닉네임
            </span>
            <div className="flex flex-row justify-between w-full">
              <div className="w-[412px]">
                <JoinInput
                  value={nickname}
                  onChange={handleNicknameChange}
                  disabled={isNicknameChecked}
                  placeholder="닉네임을 입력해주세요(최대 20글자)"
                  className="border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal"
                />
              </div>
              <JoinButton
                onClick={handleCheckDuplicate}
                variant={isNicknameChecked ? "primary" : "secondary"}
                className={`w-[106px] h-[44px] px-0 py-0 text-[14px] ${
                  isNicknameChecked ? "font-medium" : "font-normal"
                }`}
              >
                중복확인
              </JoinButton>
            </div>
          </div>

          {/* 한줄소개 */}
          <JoinInput
            label="소개"
            value={intro}
            onChange={handleIntroChange}
            placeholder="40자 이내로 작성해주세요"
            className="border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal"
          />

          {/* 이름 */}
          <JoinInput
            label="이름"
            value={name}
            onChange={handleNameChange}
            placeholder="이름을 입력해주세요"
            className="border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal"
          />

          {/* 전화번호 */}
          <JoinInput
            label="전화번호"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
            className="border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal"
          />
        </div>
      </div>

      <JoinButton onClick={onNext} disabled={!isValid}>
        다음
      </JoinButton>
    </div>
  );
};

export default ProfileSetup;
