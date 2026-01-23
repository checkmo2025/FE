import { useState, useEffect } from "react";

export const usePasswordEntry = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // 6-12자, 영문 최소 1자, 특수문자 최소 1자
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{6,12}$/;
    const isPasswordValid = passwordRegex.test(password);
    const isMatch = password === confirmPassword;

    setIsValid(isPasswordValid && isMatch && password.length > 0);
  }, [password, confirmPassword]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return {
    password,
    confirmPassword,
    isValid,
    handlePasswordChange,
    handleConfirmChange,
  };
};
