# 홈 화면 반응형 정리 (HomePage)

> 작성일: 2026-06-21
> 대상: `src/app/(main)/home/*`, `src/components/base-ui/home/*`
> 참고 브레이크포인트 (`tailwind.config.js`): `t = 768px`, `d = 1440px`
> - 모바일: `< 768px`
> - 태블릿(`t:`): `768px ~ 1439px`
> - 데스크탑(`d:`): `>= 1440px`

이 문서는 홈 화면 반응형 개선을 검토하면서 적용했던 변경 내용과 의사결정을 기록한 것이다.
**실제 코드는 원복된 상태이며, 아래 내용은 재적용 시 참고용 설계 메모이다.**

---

## 1. 배경 / 목표

태블릿/데스크탑에서는 잘 동작하지만, 모바일에서 아래 문제가 있었다.

1. 모바일에서 **독서모임 + 사용자 추천이 가로로 나란히** 붙어 좁고 답답함.
2. 사용자 추천이 화면 크기별로 **다른 컴포넌트**(모바일 전용 `ListSubscribeElement` vs 태블릿/데탑 `ListSubscribeLarge`)를 사용 → 유지보수 부담.
3. 홈의 독서모임(`HomeBookclub`)이 모임 화면(`Mybookclub`)과 **다른 컴포넌트**라 스타일이 따로 놂.
4. **비로그인 시** 모바일/태블릿에 "사용자 추천이 없습니다" **빈 박스**가 노출됨 (데스크탑은 원래 숨겨짐).

목표: 모바일 세로 정렬, 컴포넌트 재사용으로 통일, 비로그인 시 추천 영역 정리.

---

## 2. 변경 항목

### 2-1. 모바일에서 독서모임 / 사용자 추천 세로 정렬

- 파일: `src/app/(main)/home/HomePageClient.tsx`
- 독서모임 + 사용자추천을 감싸는 컨테이너의 flex 방향을 변경.

```diff
- <div className="order-2 d:order-1 flex flex-row gap-4 t:gap-6 d:gap-0 justify-center d:justify-start d:w-full d:max-w-[332px]">
+ <div className="order-2 d:order-1 flex flex-col t:flex-row gap-4 t:gap-6 d:gap-0 justify-center d:justify-start d:w-full d:max-w-[332px]">
```

- `flex-row` → `flex-col t:flex-row`
- 효과: 모바일은 세로(독서모임 → 사용자추천), 태블릿부터는 기존처럼 가로 유지.

### 2-2. 사용자 추천 — 모바일 전용 컴포넌트 제거, `ListSubscribeLarge` 재사용

- 파일: `src/components/base-ui/home/Recommendation/HomeRecommendationSection.tsx`
- 기존: 모바일(`t:hidden`)은 `ListSubscribeElement` + `MOBILE_LIMIT=3`, 태블릿/데탑(`hidden t:block`)은 `ListSubscribeLarge` 로 분기.
- 변경: 분기를 없애고 **모든 화면에서 `ListSubscribeLarge`** 만 렌더.

```diff
- import ListSubscribeElement from "./list_subscribe_element";
  import ListSubscribeLarge from "./list_subscribe_large";
- import { RecommendationSkeleton } from "../shared/HomeSkeleton";
  ...
- const MOBILE_LIMIT = 3;
  ...
- // (모바일 버전 + 태블릿/데탑 버전 분기 전부 제거)
+ return (
+   <ListSubscribeLarge
+     height="h-[424px] d:h-[380px]"
+     users={users}
+     isError={isError}
+     isLoading={isLoading}
+     onProfileClick={onProfileClick}
+     onSubscribeClick={onSubscribeClick}
+   />
+ );
```

- 로딩/에러/빈 상태 처리는 `ListSubscribeLarge` 내부 로직으로 일원화.

### 2-3. `ListSubscribeLarge` 폭을 모바일에서 반응형 처리

- 파일: `src/components/base-ui/home/Recommendation/list_subscribe_large.tsx`
- 고정폭(`w-[336px]`, 카드 `w-[296px]`)이라 좁은 모바일에서 넘칠 수 있어, **모바일 전체폭 / 태블릿부터 고정폭**으로 변경.

```diff
- className={`flex w-[296px] h-[66px] ...`}   // 카드
+ className={`flex w-full t:w-[296px] h-[66px] ...`}

- className={`w-[336px] ${height} ...`}        // 박스
+ className={`w-full t:w-[336px] ${height} ...`}
```

- 태블릿(≥768) 이상은 기존 고정폭 그대로 유지 → 태블릿/데탑 영향 없음.
- 영향: 책이야기 페이지(`StoriesPageClient`)에서 리스트에 주입되는 `ListSubscribeLarge`도 모바일에서 전체폭이 됨(스토리 카드와 정렬상 자연스러움).

### 2-4. 홈 독서모임을 모임 화면과 동일한 `Mybookclub` 으로 통일

- 파일: `src/components/base-ui/home/Club/HomeClubSection.tsx`
- 기존: 홈 전용 `HomeBookclub`(고정폭 `w-[165px] t:w-[332px]`, 1열).
- 변경: 모임 화면과 동일한 `Mybookclub`(`w-full d:w-[332px]`, 모바일 1열 / 태블릿 2열 / 데탑 1열, 3·4·6개 표시 + 전체보기 토글) 재사용.
- 두 화면 모두 `useMyClubsQuery` 동일 데이터 사용 → `MyClubInfo[]` → `{ id, name }` 매핑만 추가.

```tsx
const myGroups = groups.map((c) => ({ id: String(c.clubId), name: c.clubName }));
// ...
<Mybookclub groups={myGroups} isLoading={isLoading} />
```

- **주의**: `Mybookclub`에는 "모임 검색하기 / 모임 생성하기" 버튼이 없음(모임 화면은 생성 버튼이 카드 바깥에 별도 존재).
  홈에는 이 버튼이 내장돼 있었으므로, `HomeClubSection`을 client 컴포넌트로 전환하여 리스트 아래에 두 버튼을 다시 추가했다.
  - 비로그인 시 `openLoginModal()`, 로그인 시 `/groups`(검색) · `/groups/create`(생성) 이동.
  - 기존엔 모임 5개 미만일 때만 노출 → 변경안에서는 항상 노출(모임 화면도 생성 버튼은 상시 노출).
- `home_bookclub.tsx`는 미사용이 되므로, 재적용 시 삭제 검토 대상.

### 2-5. 비로그인 시 사용자 추천 숨김 + 태블릿 폭 제한

- 파일: `src/app/(main)/home/HomePageClient.tsx`
- 문제: 비로그인 시 추천 쿼리(`useRecommendedMembersQuery(isLoggedIn)`)가 비활성 → 데이터 0건.
  - 데스크탑: 원래도 `recommendedUsers.length > 0`일 때만 책이야기 리스트에 주입돼 숨겨짐.
  - 모바일/태블릿: 빈 박스가 노출됨.
- 결정(사용자 선택): **모바일·태블릿 모두 숨기고, 태블릿에서 독서모임이 가로로 늘어나지 않게 폭 제한**.

```tsx
// 추천이 없으면(비로그인 포함) 데스크탑과 동일하게 모바일/태블릿에서도 숨김
const showRecommendation = isLoadingMembers || recommendedUsers.length > 0;
```

```diff
- <div className="order-2 d:order-1 flex flex-col t:flex-row ... d:max-w-[332px]">
+ <div className={`order-2 d:order-1 flex flex-col t:flex-row ... d:max-w-[332px] ${
+   showRecommendation ? "" : "t:max-w-[332px]"
+ }`}>
    <HomeClubSection .../>
-   <div className="flex-1 t:flex-none d:hidden">
-     <HomeRecommendationSection .../>
-   </div>
+   {showRecommendation && (
+     <div className="flex-1 t:flex-none d:hidden">
+       <HomeRecommendationSection .../>
+     </div>
+   )}
  </div>
```

- 추천이 숨겨질 때 `t:max-w-[332px]` 적용 → 태블릿에서 독서모임이 데스크탑과 같은 332px 폭으로 좌측 정렬되어 과도하게 늘어나지 않음.
- 로그인+로딩 중에는 표시(스피너), 로그인했는데 추천 0건이어도 깔끔하게 숨김(데스크탑과 동일 기준).

#### (검토했던 다른 대안)
- 추천 자리에 "로그인하면 추천을 볼 수 있어요" + 로그인 버튼(CTA) 노출 → 레이아웃 유지하며 UX 자연스러움.
- 그냥 숨기고 독서모임이 가로 전체를 채우게 둠 → 가장 단순하나 태블릿에서 독서모임이 넓어 보임.

---

## 3. 결과 요약 (변경안 기준)

| 화면 | 독서모임 | 사용자 추천(로그인) | 사용자 추천(비로그인) |
|------|---------|------------------|--------------------|
| 모바일 | 전체폭, 세로 정렬, 검색/생성 버튼 | `ListSubscribeLarge` 전체폭 | 숨김 |
| 태블릿 | 가로 배치(2열 그리드) | `ListSubscribeLarge` 336px | 숨김 + 독서모임 332px 제한 |
| 데스크탑 | 좌측 332px 사이드 | 책이야기 리스트에 주입 | 숨김(기존과 동일) |

---

## 4. 관련 파일

- `src/app/(main)/home/HomePageClient.tsx` — 레이아웃 방향/표시 조건
- `src/components/base-ui/home/Club/HomeClubSection.tsx` — `Mybookclub` 재사용 + 버튼
- `src/components/base-ui/home/Recommendation/HomeRecommendationSection.tsx` — `ListSubscribeLarge` 단일화
- `src/components/base-ui/home/Recommendation/list_subscribe_large.tsx` — 폭 반응형
- (참고) `src/components/base-ui/Group-Search/search_mybookclub.tsx` — 재사용 대상
- (참고) `src/components/base-ui/home/Club/home_bookclub.tsx` — 변경안에서 미사용
