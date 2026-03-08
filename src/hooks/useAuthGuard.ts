"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * 전역 인증 상태를 확인하여 비로그인 사용자를 홈으로 리다이렉트하고 로그인 모달을 띄우는 훅입니다.
 */
export const useAuthGuard = () => {
    const { isLoggedIn, isInitialized, openLoginModal } = useAuthStore();
    const router = useRouter();
    const toastShownRef = useRef(false);

    useEffect(() => {
        // 초기화가 끝났을 때만 로그인 여부를 체크하여 리다이렉트합니다.
        if (isInitialized && !isLoggedIn) {
            if (!toastShownRef.current) {
                toastShownRef.current = true;
            }
            openLoginModal();
            router.push("/");
        }
    }, [isInitialized, isLoggedIn, router, openLoginModal]);

    return { isInitialized, isLoggedIn };
};
