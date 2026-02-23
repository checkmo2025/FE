"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout, setInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authService.getProfile();
        if (response.isSuccess && response.result) {
          login({
            ...response.result,
            email: response.result.email || "",
          });
        } else {
          logout();
        }
      } catch (error) {
        // 401 에러 등은 apiClient에서 이미 처리하지만, 여기서도 세션을 안전하게 초기화합니다.
        logout();
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [login, logout, setInitialized]);

  return <>{children}</>;
}
