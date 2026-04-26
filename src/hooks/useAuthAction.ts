import { useAuthStore } from "@/store/useAuthStore";

/**
 * 로그인 여부를 체크하고, 비로그인 시 로그인 모달을 띄워주는 로직을 추상화한 훅
 */
export const useAuthAction = () => {
  const { isLoggedIn, openLoginModal } = useAuthStore();

  /**
   * 전달받은 함수를 실행하기 전에 인증 여부를 확인합니다.
   * 인증되지 않은 경우 로그인 모달을 열고 함수 실행을 중단합니다.
   */
  const authAction = <T extends any[]>(action: (...args: T) => void) => {
    return (...args: T) => {
      if (!isLoggedIn) {
        openLoginModal();
        return;
      }
      action(...args);
    };
  };

  return { authAction, isLoggedIn };
};
