import { useEffect, useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { authService } from "@/services/authService";

export const useEmailVerification = () => {
  const {
    email,
    setEmail,
    verificationCode,
    setVerificationCode,
    isVerified,
    setIsVerified,
    timeLeft,
    setTimeLeft,
    showToast,
  } = useSignup();

  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isCodeValid = verificationCode.length === 6;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const startTimer = async () => {
    if (!isEmailValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await authService.verifyEmail(email);
      if (response.isSuccess) {
        showToast(response.result || "인증번호가 발송되었습니다.");
        setTimeLeft(300);
      }
    } catch (error: any) {
      showToast(error.message || "인증번호 발송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isCodeValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await authService.confirmEmail({ email, verificationCode });
      if (response.isSuccess && response.result === true) {
        setIsVerified(true);
        showToast("인증이 완료되었습니다.");
      } else {
        showToast("인증번호가 일치하지 않습니다.");
      }
    } catch (error: any) {
      showToast(error.message || "인증 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeLeft === null || timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft(timeLeft > 0 ? timeLeft - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, setTimeLeft]);

  return {
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
    formatTime,
  };
};
