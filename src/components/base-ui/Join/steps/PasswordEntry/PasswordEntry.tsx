"use client";

import React from "react";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import JoinInput from "@/components/base-ui/Join/JoinInput";
import { useSignup } from "@/contexts/SignupContext";

interface PasswordEntryProps {
  onNext: () => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ onNext }) => {
  const { password, setPassword, confirmPassword, setConfirmPassword } = useSignup();

  // 유효성 검사: 비밀번호가 입력되었고, 두 비밀번호가 일치하는지 확인
  // 스펙상 "20자 이내" 제한
  const isMatch =
    password.length > 0 && password.length <= 20 && password === confirmPassword;

  return (
    <JoinLayout title="비밀번호 입력">
      <div className="flex flex-col items-center w-full gap-[40px] t:gap-[100px]">
        {/* Form Container: Frame 2087328057 */}
        <div className="flex flex-col items-start gap-[13px] w-[270px] t:w-[526px]">
          {/* Password Input */}
          <JoinInput
            label="비밀번호"
            description="비밀번호는 6-12자, 영어 최소 1자 이상, 특수문자 최소 1자 이상"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
            className="border-Subbrown-4 placeholder-Gray-3 bg-white"
          />

          {/* Confirm Password Input */}
          <JoinInput
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            maxLength={20}
            className="border-Subbrown-4 placeholder-Gray-3 bg-white"
          />
        </div>

        <JoinButton
          onClick={onNext}
          disabled={!isMatch}
          className="w-[270px] t:w-[526px]"
        >
          다음
        </JoinButton>
      </div>
    </JoinLayout>
  );
};

export default PasswordEntry;