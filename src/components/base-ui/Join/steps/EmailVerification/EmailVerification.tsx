// c:\Users\shinwookKang\Desktop\CheckMo\FE\src\components\base-ui\Join\steps\EmailVerification\EmailVerification.tsx

"use client";

import React from "react";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import JoinInput from "@/components/base-ui/Join/JoinInput";
import { useEmailVerification } from "../useEmailVerification";

interface EmailVerificationProps {
  onNext: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onNext }) => {
  const {
    email,
    isEmailValid,
    handleEmailChange,
    verificationCode,
    isCodeValid,
    handleVerificationCodeChange,
    timeLeft,
    startTimer,
    isVerified,
    handleVerify,
    showToast,
    isToastVisible,
    formatTime,
  } = useEmailVerification();

  return (
    <JoinLayout title="이메일 인증">
      <div className="flex flex-col items-center w-full gap-[40px]">
        {/* Form Container: Frame 2087328372 */}
        <div className="flex flex-col items-center w-full gap-[30px]">
          {/* Email Input Group: Frame 2087328369 */}
          <div className="flex flex-col items-start gap-[12px] w-[270px] t:w-[526px]">
            <JoinInput
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={handleEmailChange}
              className="border-Subbrown-4 placeholder-Gray-3 bg-white"
            />
            <div className="flex flex-col items-center w-full">
              <button
                onClick={startTimer}
                disabled={!isEmailValid}
                className={`flex justify-center items-center w-full t:w-[284px] h-[48px] rounded-[8px] text-[14px] font-semibold leading-[145%] tracking-[-0.014px] transition-colors ${
                  isEmailValid
                    ? "bg-Subbrown-2 text-white"
                    : "bg-Gray-2 text-Gray-4"
                }`}
              >
                인증 번호 발송
              </button>
              {timeLeft !== null && (
                <div className="mt-[8px] text-center text-Gray-7 text-[18px] font-normal leading-[135%] tracking-[-0.018px]">
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>

          {/* Verification Code Group */}
          <div className="flex flex-col items-start gap-[12px] w-[270px] t:w-[526px]">
            <JoinInput
              label="인증번호"
              type="text"
              placeholder="인증번호를 입력해주세요"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              className="border-Subbrown-4 placeholder-Gray-3 bg-white"
            />
            <button
              onClick={handleVerify}
              disabled={!isCodeValid}
              className={`flex justify-center items-center w-full t:w-[284px] h-[48px] rounded-[8px] text-[14px] font-semibold leading-[145%] tracking-[-0.014px] self-center transition-colors ${
                isCodeValid
                  ? "bg-Subbrown-2 text-white"
                  : "bg-Gray-2 text-Gray-4"
              }`}
            >
              인증 완료
            </button>
          </div>
        </div>

        {/* Next Button: CTA_2 */}
        <JoinButton
          onClick={onNext}
          disabled={!isVerified}
          className="w-[270px] t:w-[526px]"
        >
          다음
        </JoinButton>

        {/* Toast Notification */}
        {showToast && (
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 inline-flex justify-center items-center h-auto py-4 px-8 md:h-[88px] md:px-[138px] bg-[#31111D99] rounded-[24px] backdrop-blur-[1px] transition-opacity duration-300 ${
              isToastVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-white text-[16px] md:text-[18px] font-medium leading-[135%] tracking-[-0.018px] whitespace-nowrap">
              인증이 완료되었습니다.
            </span>
          </div>
        )}
      </div>
    </JoinLayout>
  );
};

export default EmailVerification;
