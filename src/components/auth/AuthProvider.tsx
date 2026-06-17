"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import {
  PROFILE_COMPLETION_BASE_ROUTE,
  isProfileCompletionPath,
  isProfileIncompleteError,
  isProfileIncomplete,
} from "@/utils/profileCompletion";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout, setInitialized, user, isLoggedIn, isInitialized } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const shouldRequireProfileCompletion =
    isInitialized &&
    isLoggedIn &&
    isProfileIncomplete(user) &&
    !isProfileCompletionPath(pathname) &&
    !pathname?.startsWith("/admin");

  useEffect(() => {
    const initAuth = async () => {
      const setProfileIncompleteUser = (email: string = "") => {
        login({
          email,
          profileCompleted: false,
        });

        if (email) {
          Sentry.setUser({
            id: email,
            email,
          });
        } else {
          Sentry.setUser(null);
        }
      };

      const restoreProfileIncompleteUser = async () => {
        try {
          const loginStatusResponse = await authService.getLoginStatus();

          if (loginStatusResponse.isSuccess && loginStatusResponse.result) {
            setProfileIncompleteUser(loginStatusResponse.result.email || "");
            return;
          }
        } catch {
          // /members/me 403 itself means the session exists but the profile is incomplete.
        }

        setProfileIncompleteUser();
      };

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
        if (isProfileIncompleteError(error)) {
          await restoreProfileIncompleteUser();
          return;
        }

        logout();
        Sentry.setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [login, logout, setInitialized]);

  const goToProfileCompletion = () => {
    router.replace(PROFILE_COMPLETION_BASE_ROUTE);
  };

  const handleCancelGate = async () => {
    // 취소(딤 클릭/ESC 포함) → 서버 세션까지 로그아웃 후 홈으로
    // authService.logout()이 BE /auth/logout 호출 + 클라이언트 상태 정리를 모두 수행
    await authService.logout();
    Sentry.setUser(null);
    router.replace("/");
  };

  return (
    <>
      {children}
      <ConfirmModal
        isOpen={shouldRequireProfileCompletion}
        message="프로필을 완성해주세요"
        onConfirm={goToProfileCompletion}
        onCancel={handleCancelGate}
        closeOnConfirm={false}
      />
    </>
  );
}
