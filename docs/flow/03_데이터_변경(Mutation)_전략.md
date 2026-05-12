# Flow 03. 데이터 변경(Mutation) 전략

이 문서는 `src/hooks/mutations/` 디렉토리에 정의된 Mutation 훅들의 공통 설계 원칙과, 핵심 기법인 **낙관적 업데이트(Optimistic Update)**를 설명합니다.

## 1. Mutation 훅의 두 가지 전략

데이터를 변경(생성, 수정, 삭제)한 후 UI를 갱신하는 방법에는 두 가지 전략이 있으며, 상황에 따라 구분하여 사용합니다.

### 전략 A: 캐시 무효화 (`invalidateQueries`)
서버에 변경 요청 성공 후, 관련 쿼리를 무효화하여 TanStack Query가 서버에서 최신 데이터를 다시 가져오게 합니다.

*   **적합한 경우**: 단순 생성/삭제처럼 사용자가 즉각적인 반응을 강하게 요구하지 않는 작업.
*   **장점**: 구현이 단순하고 서버와의 일관성이 항상 보장됩니다.

```typescript
// 예시: useCreateBookStoryMutation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: storyKeys.all });
},
```

### 전략 B: 낙관적 업데이트 (`setQueryData` + 롤백)
서버 응답을 기다리지 않고 **먼저 UI를 업데이트**한 후, 성공하면 유지하고 실패하면 롤백합니다.

*   **적합한 경우**: '좋아요' 버튼처럼 사용자가 클릭 즉시 반응을 확인해야 하는 인터랙티브한 작업.
*   **단점**: 롤백 로직과 이전 상태(Snapshot) 관리가 필요해 구현이 복잡합니다.

## 2. 낙관적 업데이트 상세 흐름 (`useToggleStoryLikeMutation` 예시)

스토리 '좋아요'는 프로젝트에서 가장 정교한 낙관적 업데이트 구현입니다.

```
[사용자가 좋아요 버튼 클릭]
    ↓
[onMutate 실행 (API 호출 전)]
  1. 관련된 모든 쿼리 진행 중인 패치 취소 (cancelQueries)
  2. 현재 캐시 데이터 스냅샷 저장 (Snapshot)
  3. 캐시 데이터를 즉시 낙관적으로 업데이트 (setQueryData)
     → 피드 목록, 내 스토리, 다른 멤버 스토리, 상세 뷰 등 모든 관련 캐시를 한번에 업데이트
    ↓
[API 요청 실행]
    ↓ (성공 시)
[onSuccess 실행]
  → toast.success("좋아요가 반영되었습니다.")
    ↓ (실패 시)
[onError 실행]
  → 저장해둔 스냅샷으로 모든 캐시를 원상복구 (롤백)
  → toast.error("좋아요 상태 업데이트에 실패했습니다.")
    ↓ (성공/실패 관계없이 항상)
[onSettled 실행]
  → invalidateQueries({ refetchType: 'none' }) 로 마크만 해두고 즉시 refetch 없이 마무리
```

> **`refetchType: 'none'`의 의미**: 낙관적 업데이트로 UI가 이미 업데이트되어 있으므로, 즉시 refetch를 하면 화면이 깜빡일 수 있습니다. `refetchType: 'none'`은 쿼리를 '오염됨(stale)' 상태로만 표시해두고, 사용자가 다음에 포커스하거나 네비게이션할 때 자연스럽게 최신 데이터를 가져오도록 합니다.

## 3. 스팸 클릭 방지 (Throttle)

빠른 연속 클릭으로 서버에 과도한 요청이 발생하는 것을 막기 위해 500ms 쓰로틀링이 적용되어 있습니다.

```typescript
const likeThrottleMap: Record<number, number> = {};

// 같은 스토리에 500ms 이내 재요청 시 API를 호출하지 않고 종료
if (Date.now() - lastTime < 500) {
  return;
}
```

## 4. 광범위한 캐시 업데이트의 이유

좋아요 하나를 토글했을 때 `infiniteList`, `myList`, `otherMember`, `list`, `detail` 등 여러 캐시를 동시에 업데이트하는 이유는, 사용자가 다른 탭이나 뷰로 이동했을 때도 좋아요 상태가 일관되게 보여야 하기 때문입니다. 이를 통해 서버 재요청 없이 일관된 UI를 제공합니다.

---
다음 문서: `04_권한_및_접근_제어(Guards).md`
