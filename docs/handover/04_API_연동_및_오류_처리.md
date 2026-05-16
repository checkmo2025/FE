# 04. API 연동 및 오류 처리

CheckMo 프론트엔드는 안정적이고 일관된 API 통신을 위해 `fetch` API를 래핑한 커스텀 `apiClient`를 사용합니다.

## 1. apiClient의 구조 (`src/lib/api/client.ts`)

`apiClient`는 단순한 HTTP 클라이언트를 넘어, 프로젝트 전반에 필요한 회복 탄력성(Resilience)과 일관성을 보장합니다.

### 주요 기능
*   **Query String Builder**: `params` 객체를 전달받아 자동으로 URL 쿼리 파라미터로 변환합니다.
*   **Timeout Controller**: `AbortController`를 사용하여 설정된 시간(기본 10초) 내에 응답이 없으면 요청을 강제 취소합니다.
*   **보안 및 인증**: 모든 요청에 `credentials: "include"` 속성을 추가하여 토큰이 담긴 쿠키를 서버로 안전하게 전송합니다.
*   **메서드 분리**: `.get`, `.post`, `.put`, `.delete` 등 RESTful 컨벤션에 맞는 헬퍼 함수를 제공합니다.

## 2. 전역 오류 처리 및 인터셉터

API 응답 실패 시 개별 컴포넌트에서 매번 에러를 처리하는 중복을 피하기 위해(DRY 원칙), `apiClient` 내부에서 공통 오류를 처리합니다.

### 401 Unauthorized 처리 (인터셉터 역할)
서버에서 401 응답이 오면 세션이 만료된 것으로 간주합니다.
*   `apiClient` 내부에서 `useAuthStore.getState().logout()`을 직접 호출하여 즉시 전역 인증 상태를 초기화합니다.
*   사용자는 자동으로 로그아웃 상태로 전환됩니다.

### 응답 정규화 및 ApiError
*   **JSON 파싱**: 응답의 `Content-Type`을 확인하여 안전하게 JSON 파싱을 시도합니다.
*   **오류 던지기**: HTTP 상태 코드가 2xx가 아니거나, 응답 Body의 `isSuccess` 플래그가 `false`인 경우 비정상 응답으로 간주합니다.
*   **ApiError 클래스**: 이 경우 `getErrorMessage` 헬퍼를 통해 사용자가 이해할 수 있는 에러 메시지로 변환한 후, 커스텀 에러인 `ApiError` 객체를 throw 합니다.

### Timeout 및 네트워크 오류 알림
요청 시간이 초과되거나(`AbortError`) 치명적인 네트워크 에러 발생 시, `react-hot-toast`를 사용하여 화면 상단에 오류 메시지를 전역적으로 띄워 사용자에게 알립니다.

## 3. 서비스 레이어 (Service Layer)

모든 `apiClient` 호출은 도메인별 서비스 파일(`src/services/`)에 정의되어야 합니다. 컴포넌트나 훅에서 직접 `apiClient`를 호출하는 것은 금지됩니다. (SoC 원칙)

```typescript
// 올바른 예시: 서비스 레이어를 통한 호출
export const bookSearchService = {
  search: async (query: string) => {
    // 엔드포인트 상수를 활용하여 하드코딩 방지
    return await apiClient.get(BOOK_ENDPOINTS.SEARCH, { params: { query } });
  }
};
```

---
다음 문서: `05_컴포넌트_및_스타일_가이드.md`
