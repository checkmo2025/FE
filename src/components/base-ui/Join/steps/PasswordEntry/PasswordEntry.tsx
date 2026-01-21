import React from "react";
import JoinHeader from "../../JoinHeader ";
import JoinButton from "../../JoinButton";
import JoinInput from "../../JoinInput";
import { usePasswordEntry } from "./usePasswordEntry";

interface PasswordEntryProps {
  onNext?: () => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ onNext }) => {
  const {
    password,
    confirmPassword,
    isValid,
    handlePasswordChange,
    handleConfirmChange,
  } = usePasswordEntry();
  return (
    <div className="relative flex flex-col items-center w-[766px] px-[56px] py-[99px] bg-white rounded-[8px]">
      <JoinHeader title="비밀번호 입력" />

      <div className="flex flex-col w-full mt-[120px] mb-[306px]">
        {/* Main Container for Inputs */}
        <div className="flex flex-col items-start w-[526px] gap-[13px] mx-auto">
          {/* 비밀번호 입력 필드 (커스텀 라벨) */}
          <div className="flex flex-col w-full gap-[13px]">
            <div className="flex flex-row items-center gap-2">
              <span className="text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
                비밀번호
              </span>
              <span className="text-[#8D8D8D] text-[12px] font-medium leading-[145%] tracking-[-0.012px]">
                비밀번호는 6-12자, 영어 최소 1자 이상, 특수문자 최소 1자 이상
              </span>
            </div>
            <JoinInput
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              className="border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal"
            />
          </div>

          {/* 비밀번호 확인 입력 필드 */}
          <JoinInput
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={handleConfirmChange}
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

export default PasswordEntry;
