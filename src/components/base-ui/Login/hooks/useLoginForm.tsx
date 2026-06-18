import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm, User } from "@/types/auth";
import { authService } from "@/services/authService";
import { ApiError } from "@/lib/api/errors";
import {
  isProfileIncomplete,
  PROFILE_COMPLETION_ROUTE,
} from "@/utils/profileCompletion";

export default function useLoginForm(onSuccess?: () => void) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState<LoginForm>({ identifier: "", password: "" });

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
    if (!form.identifier) newErrors.identifier = "이메일 또는 닉네임을 입력해주세요.";
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
      await authService.login(form);

      let loggedInUser: User = {
        email: form.identifier,
      };
      let profileResolved = false;

      // 상세 프로필 정보 가져오기
      try {
        const profileResponse = await authService.getProfile();

        if (profileResponse.isSuccess && profileResponse.result) {
          // 전역 상태에 상세 정보 저장
          loggedInUser = {
            ...profileResponse.result,
            email: form.identifier
          };
          profileResolved = true;
        }

        login(loggedInUser);
      } catch (profileError) {
        console.error("Profile fetch failed during login:", profileError);
        // 프로필 로드 실패 시 프로필 완성 여부를 단정하지 않고 최소 정보로 로그인 처리
        login(loggedInUser);
      }

      // 2. Navigation & UI Feedback
      queryClient.clear();
      router.refresh();
      toast.success("로그인에 성공했습니다!");
      if (onSuccess) onSuccess();
      // 프로필을 확실히 조회했고 그게 미완성일 때만 완성 페이지로, 그 외(실패/불명)는 홈으로
      router.push(
        profileResolved && isProfileIncomplete(loggedInUser)
          ? PROFILE_COMPLETION_ROUTE
          : "/"
      );
    } catch (error) {
      if (error instanceof ApiError) {
        // 비즈니스 에러 (예: 비밀번호 불일치)는 인라인 에러로 처리
        setErrors({ identifier: error.message });
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

    let authUrl = "";
    switch (provider) {
      case "google":
        authUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || "";
        break;
      case "kakao":
        authUrl = process.env.NEXT_PUBLIC_KAKAO_AUTH_URL || "";
        break;
      case "naver":
        authUrl = process.env.NEXT_PUBLIC_NAVER_AUTH_URL || "";
        break;
      default:
        toast.error("지원하지 않는 로그인 방식입니다.");
        return;
    }

    if (authUrl) {
      window.location.href = authUrl;
    } else {
      toast.error("로그인 주소 설정이 누락되었습니다.");
    }
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
