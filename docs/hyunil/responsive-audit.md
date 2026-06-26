# 반응형 깨짐 지점 일괄 점검·수정 계획

> 작성일: 2026-06-23
> 적용 브랜치: **`refactor-405-home`가 아닌 별도 브랜치**(예: `main`에서 분기한 `refactor-XXX-responsive`)에서 진행
> 이 문서는 적용 전 참고용 설계 메모이다. (작성 시점 기준이며, 적용 전 각 지점을 실제로 확인할 것)

## Context
소식 상세(`NewsDetailClient`)에서 본문 컨테이너가 `t:px-0`이라 태블릿에서 좌우 패딩이 0이 되어 텍스트가 화면 가장자리에 붙어 잘리던 버그를 고쳤다. 같은 부류의 반응형 이상(가장자리에 붙음, 모바일 오버플로, 내용보다 큰 고정폭/고정높이, 디자인 기준과 다른 브레이크포인트)이 앱 곳곳에 더 있을 것으로 보여, **메인 사용자 화면 중심으로 한 번에 훑어 수정**한다.

목표: 모바일(<768) / 태블릿(`t:` 768–1439) / 데스크탑(`d:` ≥1440) 세 구간에서 좌우 여백·폭·정렬이 자연스럽게 보이도록 통일.

## 브레이크포인트 & 표준 컨벤션 (수정 레시피)
- 브레이크포인트: `t:`=768, `d:`=1440 (min-width). **`md:`(=768)는 `t:`와 동일** → 변환 불필요.
- **페이지 래퍼**: `mx-auto w-full max-w-[1400px] px-4 t:px-6` (홈/메인 기준).
- **본문(1040 폭) 컨테이너**: `mx-auto w-full max-w-[1040px] px-5 t:px-6` — **좌우 패딩이 0으로 떨어지지 않게**(현재 `t:px-0`이 문제).
- **고정폭 컴포넌트**: 모바일 폭(~360–420px)을 넘는 `w-[Npx]`는 → `w-full max-w-[Npx]`(중앙) 또는 `w-full t:w-[Npx]`(모바일 전체폭/태블릿+ 고정).
- **min-width 압박**: 모바일에서 콘텐츠를 짓누르는 `min-w-[N]` → `min-w-0` 또는 `min-w-[작게] t:min-w-[N]`.
- **고정 높이**: 내용/뷰포트보다 큰 `h-[N]` → `h-auto`(또는 `min-h-[..] t:h-[..]`). (추천 박스에 이미 적용한 방식)
- **브레이크포인트 정리**: `lg:`(1024)·`xl:`(1280)처럼 `d:`(1440)와 다른 것만 `d:`로. `md:`는 그대로 둠.

## 범위
- **포함**: 그룹(상세/공지상세/미팅·북케이스 — 사용자용), 검색, 책이야기(목록/상세/작성/수정), 공개 인증(로그인 모달/아이디·비번 찾기/회원가입), 알림·신고 등 공용 컴포넌트, 설정 신고/차단 리스트, 마이페이지/프로필.
- **제외(기본)**: `(admin)` 라우트, 그룹 `admin/*`(공지·북케이스 작성·편집), 관리자 전용 컴포넌트. 데스크탑 전용 의도 가능성 → 별도 요청 시 진행.
- **이미 완료(기준선)**: 홈(`HomePageClient` 등), 소식 상세(`NewsDetailClient`). → `refactor-405-home` 브랜치 참고.

## 작업 방식
타겟 className 수정만. 공용 컨테이너 컴포넌트 도입 등 리팩터링은 하지 않음. 각 지점은 **수정 전 해당 화면을 모바일/태블릿 폭에서 눈으로 확인 후** 표준 레시피 적용(자동탐지에 오탐 있어 맹목 적용 금지).

## 배치 (각 배치 = 화면 단위 검증 후 1 커밋)

### Batch A — 그룹 상세/공지/미팅 (사용자용)
- `t:px-0` 본문 패딩 → `t:px-6`:
  - `src/app/(main)/groups/[id]/bookcase/[bookId]/meeting/MeetingPageClient.tsx` (L430, L442, L453, `px-5 t:px-0`)
  - `src/components/base-ui/Bookcase/bookid/TeamSection.tsx` (L33, `px-5 t:px-0` — 내부 행인지 확인 후 적용)
- `src/app/(main)/groups/[id]/notice/[noticeId]/NoticeDetailPageClient.tsx` (L75 `px-[18px]`, L77/L94 `px-0`/`w-[1040px]`) → 표준 본문 패턴으로.
- `src/components/base-ui/Group/notice_detail.tsx` (L465 `min-w-[300px]`) → `min-w-0 t:min-w-[300px]`.
- 그룹 목록 `src/app/(main)/groups/GroupsPageClient.tsx` (L177 `px-6`) → `px-4 t:px-6`.

### Batch B — 검색 / 책이야기
- 페이지 좌우 패딩에 `t:px-6` 누락/모바일 px 누락 보정(수정 전 확인):
  - `SearchPageClient`(L100 `t:px-8` 등), `StoriesPageClient`, `StoryDetailClient`, `StoryNewPageClient`, `StoryEditPageClient`, `NewsPageClient`.
- 책이야기 그리드 비표준 브레이크포인트(`min-[540px]:`, `lg:`)가 디자인(`t:`/`d:`)과 어긋나는지 확인 후 정리: `src/components/base-ui/BookStory/Common/BookStoryInfiniteList.tsx` (L47–48).

### Batch C — 공개 인증 플로우
- `w-[766px]` 고정폭 → `w-full max-w-[766px]`: `find-account/FindAccountPageClient`(L45), `find-account/result/FindAccountResultPageClient`(L31), `find-password/FindPasswordPageClient`(L40).
- `src/components/common/find-account/PrimaryButton.tsx` (L11 `w-[258px]`) → `w-full t:w-[258px]`.
- 로그인 모달 `src/components/base-ui/Login/LoginModal.tsx`(L47 모바일 290px·`d:` 없음), 회원가입 모달류(`JoinLayout`, `steps/TermsAgreement`, `steps/SignupComplete`) — 모바일 안전영역·데스크탑 폭 확인 후 보정.

### Batch D — 알림/신고 등 공용 컴포넌트
- `src/components/layout/NotificationDropdown.tsx`(L33 `w-[364px]`) → `w-full max-w-[364px]`.
- `src/components/base-ui/home/notification_element.tsx`(L32 `w-[364px]`) → `w-full` (모바일).
- `src/components/common/modals/report-block/ReportModal.tsx`(L61 `w-[734px]`, 내부 L114 `w-[614px]`, 버튼 L90 `w-[144px]`×4) → `w-full max-w-[734px]` + 버튼 래핑/축소.

### Batch E — 설정 신고/차단 리스트
- `src/components/base-ui/Settings/setting_report_list.tsx`(L24 `w-[1000px]`) → `w-full max-w-[1000px]`; 배지 L32 `w-[60px]`는 `truncate` 검토.
- `src/components/base-ui/Settings/setting_news_list.tsx`(L49 날짜 `min-w-[180px]`) → `min-w-[80px] t:min-w-[180px]`.
- 주의: `w-full md:w-[440px]` 류(ReportItem/BlockedUserItem)는 `md:`==`t:`라 **갭 없음 → 변경 불필요**.

### Batch F — 마이페이지/프로필 (확인 위주)
- `UserProfile.tsx`, `ProfileUserInfo.tsx` 등은 `md:`(==`t:`) 사용이라 기능상 정상. `lg:`/`xl:`가 섞여 디자인과 어긋나는 부분만 `d:`로. JS 분기(`window.innerWidth`)는 동작하면 그대로 둠.

## 검증
각 배치마다:
1. `npx tsc --noEmit` (타입 0), `npx eslint <변경파일>` (에러 0).
2. `npm run dev` 후 해당 화면을 **모바일(~390) / 태블릿(~900) / 데스크탑(~1500)** 폭에서 확인 — 좌우 여백, 가로 스크롤(오버플로) 없음, 잘림 없음.
3. 스크린샷 확인 → 이상 없으면 커밋·푸시.

## 참고: 에이전트 자동탐지 주의
- 자동 점검 시 `md:`를 별도(더 큰) 브레이크포인트로 오해해 "태블릿 변형 누락/갭" 류를 다수 오탐함. 실제 `md:`==`t:`(768)이라 그 경우 갭 없음 → 맹신 금지.
