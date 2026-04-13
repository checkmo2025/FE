import { useEffect } from "react";

// 중첩 모달 환경에서 각 모달이 독립적으로 스크롤을 잠갔다 풀 수 있도록 카운터 사용.
// 마지막 모달이 닫힐 때(lockCount === 0)만 스크롤을 복원함.
let lockCount = 0;

export const useScrollLock = (lock: boolean = true) => {
  useEffect(() => {
    if (!lock) return;

    lockCount++;
    document.body.style.overflow = "hidden";

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = "";
      }
    };
  }, [lock]);
};
