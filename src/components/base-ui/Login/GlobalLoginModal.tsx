"use client";

import { useAuthStore } from "@/store/useAuthStore";
import LoginModal from "./LoginModal";

/**
 * 앱 전체에서 단 하나의 LoginModal 인스턴스만 마운트되도록 보장하는 래퍼.
 * RootLayout에서만 렌더링하며, 하위 페이지/컴포넌트에서는 LoginModal을 직접 렌더링하지 않음.
 * useScrollLock이 중복 실행되어 body.style.overflow가 꼬이는 버그를 방지한다.
 */
export default function GlobalLoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuthStore();

  if (!isLoginModalOpen) return null;

  return <LoginModal onClose={closeLoginModal} />;
}
