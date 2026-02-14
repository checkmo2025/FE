import { useState } from "react";

export const usePasswordEntry = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 6-12자, 영문 최소 1자, 특수문자 최소 1자
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{6,12}$/;

  // Derived State (No useEffect)
  const isComplexityValid = passwordRegex.test(password);
  const isMatch = password === confirmPassword;
  const isValid =
    isComplexityValid &&
    isMatch &&
    password.length > 0 &&
    confirmPassword.length > 0;

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
    isComplexityValid,
    isMatch,
    handlePasswordChange,
    handleConfirmChange,
  };
};
