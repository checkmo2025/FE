"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import * as Sentry from "@sentry/nextjs";
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
          Sentry.setUser({
            id: response.result.email || "unknown",
            email: response.result.email || undefined,
            username: response.result.nickname,
          });
        } else {
          logout();
          Sentry.setUser(null);
        }
      } catch (error) {
        // 401 에러 등은 apiClient에서 이미 처리하지만, 여기서도 세션을 안전하게 초기화합니다.
        logout();
        Sentry.setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [login, logout, setInitialized]);

  return <>{children}</>;
}
