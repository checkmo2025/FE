import React from "react";
import JoinHeader from "../../JoinHeader ";
import JoinButton from "../../JoinButton";
import JoinInput from "../../JoinInput";
import { useEmailVerification } from "../useEmailVerification";

interface EmailVerificationProps {
  onNext?: () => void;
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
    <div className="relative flex flex-col items-center w-[766px] px-[56px] py-[99px] bg-white rounded-[8px]">
      <JoinHeader title="이메일 인증" />
      <div className="flex flex-col w-full mt-[90px] mb-[130px]">
        {/* 이메일 입력 섹션 */}
        <div className="flex flex-col items-center w-[526px] gap-[30px] mx-auto">
          <JoinInput
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmailChange}
            className="border-[#E5E5E5] placeholder-[#D9D9D9]"
          />
          <div className="flex flex-col items-center w-full">
            <button
              onClick={startTimer}
              disabled={!isEmailValid}
              className={`flex justify-center items-center w-[284px] h-[48px] rounded-[8px] text-[14px] font-semibold leading-[145%] tracking-[-0.014px] ${
                isEmailValid
                  ? "bg-[#BBAA9B] text-[#FFF]"
                  : "bg-[#DADADA] text-[#8D8D8D]"
              }`}
              style={{
                textShadow: "0.709px 0.709px 0.709px rgba(0, 0, 0, 0.00)",
              }}
            >
              인증 번호 발송
            </button>
            {timeLeft !== null && (
              <div className="mt-[8px] self-stretch text-center text-[#2C2C2C] text-[18px] font-normal leading-[135%] tracking-[-0.018px]">
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>

        {/* 인증번호 입력 섹션 */}
        <div className="flex flex-col items-center w-[526px] gap-[30px] mx-auto mt-[53px]">
          <JoinInput
            label="인증번호"
            type="text"
            placeholder="인증번호를 입력해주세요"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            className="border-[#EAE5E2] placeholder-[#BBB] text-[14px] font-normal leading-[145%] tracking-[-0.014px]"
          />
          <button
            onClick={handleVerify}
            disabled={!isCodeValid}
            className={`flex justify-center items-center w-[284px] h-[48px] rounded-[8px] text-[14px] font-semibold leading-[145%] tracking-[-0.014px] ${
              isCodeValid
                ? "bg-[#BBAA9B] text-[#FFF]"
                : "bg-[#DADADA] text-[#8D8D8D]"
            }`}
            style={{
              textShadow: "0.709px 0.709px 0.709px rgba(0, 0, 0, 0.00)",
            }}
          >
            인증 완료
          </button>
        </div>
      </div>
      {/* 하단 버튼 (임시로 클릭 시 다음 단계 이동 동작 연결) */}
      <JoinButton onClick={onNext} disabled={!isVerified}>
        다음
      </JoinButton>
      {showToast && (
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 inline-flex justify-center items-center h-[88px] pl-[138px] pr-[137px] bg-[#31111D99] rounded-[24px] backdrop-blur-[1px] transition-opacity duration-300 ${
            isToastVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-[#FFF] text-[18px] font-medium leading-[135%] tracking-[-0.018px] whitespace-nowrap">
            인증이 완료되었습니다.
          </span>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
