"use client";

import React from "react";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import JoinInput from "@/components/base-ui/Join/JoinInput";
import { useSignup } from "@/contexts/SignupContext";
import { authService } from "@/services/authService";

interface PasswordEntryProps {
  onNext: () => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ onNext }) => {
  const { email, password, setPassword, confirmPassword, setConfirmPassword, showToast } = useSignup();
  const [isLoading, setIsLoading] = React.useState(false);

  // 유효성 검사: 비밀번호가 입력되었고, 두 비밀번호가 일치하는지 확인
  const isMatch =
    password.length >= 6 && password.length <= 20 && password === confirmPassword;

  const handleNext = async () => {
    if (!isMatch || isLoading) return;

    setIsLoading(true);
    try {
      const response = await authService.signup({ email, password });
      if (response.isSuccess) {
        onNext();
      }
    } catch (error: any) {
      showToast(error.message || "회원가입 중 오류가 발생했습니다.");
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