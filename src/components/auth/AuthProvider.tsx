"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    // Hydration Logic: Check for token on app load
    const token = Cookies.get("accessToken");
    if (token) {
      // If token exists, restore session state.
      // Note: Since we don't store user details in the cookie,
      // we pass a placeholder or partial data to set isLoggedIn to true.
      // TODO: Call /api/auth/me here to fetch full user profile and validate token.
      // If fetch fails (401), the interceptor in apiClient will handle logout.
      login({ email: "" });
    }
  }, [login]);

  return <>{children}</>;
}
