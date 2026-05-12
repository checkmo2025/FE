# Flow 04. 권한 및 접근 제어 (Guards)

이 문서는 비로그인 사용자 또는 권한 없는 멤버가 특정 페이지나 기능에 접근하는 것을 차단하는 가드(Guard) 시스템을 설명합니다.

## 1. 가드의 종류와 계층

```
[useAuthGuard]               ← 로그인 여부 체크 (1차 방어선)
     ↓ 로그인 확인 후
[useClubAccessGuard]         ← 모임 내 역할 체크 (2차 방어선)
     ↓ 멤버/운영진 확인 후
[컴포넌트 내부 isStaff 분기] ← 세부 UI 권한 제어 (3차)
```

## 2. `useAuthGuard`: 로그인 여부 확인

특정 페이지가 **반드시 로그인**을 요구하는 경우, 해당 페이지의 최상단 컴포넌트에서 이 훅을 호출합니다.

**작동 방식:**
1.  `useAuthStore`에서 `isInitialized`와 `isLoggedIn`을 구독합니다.
2.  `isInitialized === true` (세션 확인 완료) 이고 `isLoggedIn === false` (비로그인) 인 경우에만 동작합니다.
3.  `openLoginModal()`로 로그인 모달을 띄우고, `router.push('/')`로 홈으로 리다이렉트합니다.

> **`isInitialized` 체크가 왜 중요한가?**: 앱 초기 로드 시 `AuthProvider`가 세션을 확인하는 동안은 `isLoggedIn`이 일시적으로 `false`입니다. `isInitialized` 없이 바로 체크하면 세션이 있는 사용자도 순간적으로 홈으로 리다이렉트되는 버그가 발생합니다.

## 3. `useClubAccessGuard`: 모임 내 역할 확인

특정 모임의 **내부 페이지**(서재, 채팅, 공지 등)에 접근할 때, 해당 사용자가 모임의 멤버인지, 또는 운영진인지를 확인합니다.

**작동 방식:**
1.  `useClubMeQuery(clubId)`를 통해 서버에서 현재 사용자의 모임 내 상태(`MyClubStatusResponseResult`)를 조회합니다.
2.  `myStatus` 값을 `MEMBER_STATUSES`와 `STAFF_STATUSES` 집합과 비교하여 역할을 판별합니다.

| `myStatus` 값 | 멤버 여부 | 운영진 여부 |
| :--- | :---: | :---: |
| `OWNER` | ✅ | ✅ |
| `STAFF` | ✅ | ✅ |
| `MEMBER` | ✅ | ❌ |
| 그 외 | ❌ | ❌ |

3.  `require` 옵션에 따라 필요한 최소 권한이 없으면 토스트 메시지를 띄우고 `router.back()` 또는 `fallbackPath`로 리다이렉트합니다.

**사용 예시:**
```tsx
// 운영진만 접근 가능한 페이지
const { isAllowed, isStaff } = useClubAccessGuard({
  clubId,
  require: 'staff',
  toastMessage: '운영진만 접근이 가능합니다.',
});
```

## 4. `handledRef`로 중복 가드 실행 방지

가드 로직은 `useEffect` 내에서 실행되는데, 컴포넌트의 상태 변화로 `useEffect`가 여러 번 실행될 수 있습니다. 이미 리다이렉트를 처리했음에도 또다시 실행되는 것을 방지하기 위해 `handledRef.current = true` 플래그를 사용합니다.

---
다음 문서: `05_전역_UI_및_공통_유틸리티.md`
