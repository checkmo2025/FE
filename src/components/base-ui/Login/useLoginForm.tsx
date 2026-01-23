import { useState } from "react";

export interface LoginForm {
  id: string;
  password: string;
}

export default function useLoginForm() {
  const [form, setForm] = useState<LoginForm>({ id: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // 사용자가 다시 입력하면 에러 메시지 초기화 (Reset Logic)
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async () => {
    // 1. Validation (Inline Error)
    const newErrors: Partial<LoginForm> = {};
    if (!form.id) newErrors.id = "아이디를 입력해주세요.";
    if (!form.password) newErrors.password = "비밀번호를 입력해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isLoading) return;

    // 2. Submission Logic
    setIsLoading(true);
    try {
      console.log("로그인 시도:", form);
      // TODO: API Call here
      // await api.login(form);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success handling (e.g., close modal, redirect)
      // onClose();
    } catch (error) {
      console.error("로그인 실패:", error);
      // 로그인 실패 시 전체 에러 처리 등을 추가할 수 있습니다.
      alert("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (isLoading) return;
    console.log(`${provider} 로그인 시도`);
    // TODO: 소셜 로그인(OAuth) 리다이렉트 로직 구현
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return {
    form,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    handleSocialLogin,
    handleKeyDown,
  };
}
