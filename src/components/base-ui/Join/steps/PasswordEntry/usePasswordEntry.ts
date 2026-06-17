import { useState } from "react";
import { isPasswordValid } from "@/constants/password";

export const usePasswordEntry = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Derived State (No useEffect)
  const isComplexityValid = isPasswordValid(password);
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
