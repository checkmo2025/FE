import { useEffect } from "react";
import { useSignup } from "@/contexts/SignupContext";

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

  const startTimer = () => {
    if (isEmailValid) {
      setTimeLeft(300);
    }
  };

  const handleVerify = () => {
    if (isCodeValid) {
      setIsVerified(true);
      showToast("인증이 완료되었습니다.");
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
