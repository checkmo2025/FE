import { useEffect } from "react";

// 중첩 모달 환경에서 각 모달이 독립적으로 스크롤을 잠갔다 풀 수 있도록 카운터 사용.
let lockCount = 0;
// 첫 번째 모달이 열리기 전의 원래 body overflow 인라인 스타일을 저장
let originalOverflow = "";

export const useScrollLock = (lock: boolean = true) => {
  useEffect(() => {
    if (!lock) return;

    if (lockCount === 0) {
      // 최초 1회 잠금 시 원래의 인라인 스타일 저장
      originalOverflow = document.body.style.overflow;
    }

    lockCount++;
    document.body.style.overflow = "hidden";

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        // 빈 문자열("") 대신, 방어적으로 저장해둔 원래 스타일로 복원
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [lock]);
};
