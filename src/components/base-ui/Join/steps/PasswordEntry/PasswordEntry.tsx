"use client";

import React from "react";
import JoinHeader from "../../JoinHeader";
import JoinButton from "../../JoinButton";
import JoinInput from "../../JoinInput";
import { usePasswordEntry } from "./usePasswordEntry";

interface PasswordEntryProps {
  onNext: () => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ onNext }) => {
  const {
    password,
    confirmPassword,
    isValid,
    isComplexityValid,
    isMatch,
    handlePasswordChange,
    handleConfirmChange,
  } = usePasswordEntry();

  return (
    <div className="relative flex flex-col items-center mx-auto w-full max-w-[766px] bg-white rounded-[8px] px-6 py-10 md:px-[40px] md:py-[60px] lg:px-[56px] lg:py-[99px]">
      <JoinHeader title="비밀번호 입력" />

      {/* Content Wrapper: Mobile(mt-10 mb-10) -> Tablet(mt-[60px] mb-[80px]) -> Desktop(mt-[90px] mb-[130px]) */}
      <div className="flex flex-col w-full mt-10 mb-10 md:mt-[60px] md:mb-[80px] lg:mt-[90px] lg:mb-[130px]">
        <div className="flex flex-col items-center w-full max-w-[526px] gap-[30px] mx-auto">
          {/* Password Input Section */}
          <div className="flex flex-col w-full gap-2">
            {/* Custom Label Layout for Password */}
            <div className="flex flex-wrap items-end gap-2 mb-1">
              <span className="text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
                비밀번호
              </span>
              <span className="hidden lg:inline text-[#8D8D8D] text-[12px] font-medium leading-[145%] tracking-[-0.012px] mb-[3px]">
                비밀번호는 6-12자, 영어 최소 1자 이상, 특수문자 최소 1자 이상
              </span>
            </div>

            <JoinInput
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={handlePasswordChange}
              className={`border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal ${
                !isComplexityValid && password.length > 0
                  ? "border-red-500"
                  : ""
              }`}
              hideLabel // Using custom label above
            />

            {!isComplexityValid && password.length > 0 && (
              <span className="text-red-500 text-[12px] ml-1">
                비밀번호 형식이 올바르지 않습니다.
              </span>
            )}
          </div>

          {/* Confirm Password Input Section */}
          <div className="flex flex-col w-full gap-2">
            {/* Custom Label Layout for Confirm Password */}
            <div className="flex flex-wrap items-end gap-2 mb-1">
              <span className="text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
                비밀번호 확인
              </span>
            </div>

            <JoinInput
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              value={confirmPassword}
              onChange={handleConfirmChange}
              className={`border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal ${
                !isMatch && confirmPassword.length > 0 ? "border-red-500" : ""
              }`}
              hideLabel
            />

            {!isMatch && confirmPassword.length > 0 && (
              <span className="text-red-500 text-[12px] ml-1">
                비밀번호가 일치하지 않습니다.
              </span>
            )}
          </div>
        </div>
      </div>

      <JoinButton
        onClick={onNext}
        disabled={!isValid}
        className="w-full md:w-[526px]"
      >
        다음
      </JoinButton>
    </div>
  );
};

export default PasswordEntry;
