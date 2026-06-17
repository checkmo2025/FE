"use client";

import React from "react";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import JoinInput from "@/components/base-ui/Join/JoinInput";
import { useSignup } from "@/contexts/SignupContext";
import { authService } from "@/services/authService";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  isPasswordValid,
} from "@/constants/password";

interface PasswordEntryProps {
  onNext: () => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ onNext }) => {
  const { email, password, setPassword, confirmPassword, setConfirmPassword, showToast } = useSignup();
  const [isLoading, setIsLoading] = React.useState(false);

  const isMatch =
    isPasswordValid(password) && password === confirmPassword;

  const handleNext = async () => {
    if (!isMatch || isLoading) return;

    setIsLoading(true);
    try {
      await authService.signup({ email, password });
      await authService.login({ identifier: email, password });
      onNext();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.";
      showToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <JoinLayout title="비밀번호 입력">
      <div className="flex flex-col items-center w-full gap-[40px] t:gap-[100px]">
        {/* Form Container: Frame 2087328057 */}
        <div className="flex flex-col items-start gap-[13px] w-[270px] t:w-[526px]">
          {/* Password Input */}
          <JoinInput
            label="비밀번호"
            description={PASSWORD_REQUIREMENTS_MESSAGE}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={PASSWORD_MAX_LENGTH}
            className="border-Subbrown-4 placeholder-Gray-3 bg-white"
          />

          {/* Confirm Password Input */}
          <JoinInput
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            maxLength={PASSWORD_MAX_LENGTH}
            className="border-Subbrown-4 placeholder-Gray-3 bg-white"
          />
        </div>

        <JoinButton
          onClick={handleNext}
          disabled={!isMatch || isLoading}
          className="w-[270px] t:w-[526px]"
        >
          {isLoading ? "처리 중..." : "다음"}
        </JoinButton>
      </div>
    </JoinLayout>
  );
};

export default PasswordEntry;
