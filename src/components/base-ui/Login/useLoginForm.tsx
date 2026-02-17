import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm } from "@/types/auth";
import { authService } from "@/services/authService";
import { ApiError } from "@/lib/api/ApiError";

export default function useLoginForm(onSuccess?: () => void) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

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
    if (!form.email) newErrors.email = "이메일을 입력해주세요.";
    if (!form.password) newErrors.password = "비밀번호를 입력해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isLoading) return;

    // 2. Submission Logic
    setIsLoading(true);
    setErrors({});

    try {
      // Service Layer 호출
      const data = await authService.login(form);

      console.log("로그인 성공:", data);

      // 1. Global State Update
      login({ email: form.email });

      // 2. Navigation & UI Feedback
      toast.success("로그인에 성공했습니다!");
      if (onSuccess) onSuccess();
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        // 비즈니스 에러 (예: 비밀번호 불일치)는 인라인 에러로 처리
        setErrors({ email: error.message });
      } else {
        console.error("로그인 실패:", error);
        toast.error("로그인 요청 중 오류가 발생했습니다.");
      }
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
