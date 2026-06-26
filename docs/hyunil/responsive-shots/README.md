# 반응형 수정 변경 전/후 스크린샷

`responsive-audit.md` 계획에 따라 진행한 반응형 일괄 수정(refactor-409)의 변경 전/후 비교 스크린샷.

## 파일 명명 규칙
`<화면>-<폭>-<상태>.png`
- 폭: `m`=모바일(390px) · `t`=태블릿(900px) · `d`=데스크탑(1500px)
- 상태: `before`(수정 전) · `after`(수정 후)

## 화면 ↔ 배치(커밋) 매핑
| 화면(파일 prefix) | 배치 | 핵심 변경 |
|---|---|---|
| `meeting`, `bookcase-detail`, `notice-detail` | A | 그룹 공지/미팅/책장 `t:px-0`→`t:px-6`, 댓글 패딩 정렬, `min-w` |
| `find-account`, `find-password` | C | 모바일 카드 `w-[766px]` 오버플로 → `w-full max-w` |
| `setting-report`, `setting-news` | E | 고정폭 `w-[1000px]`/`min-w` 보정 |
| `story-detail` | B | 책이야기 상세 본문 `px-5`→`px-5 t:px-6` |
| `report-modal`, `notif-dropdown` | D | 신고 모달 오버플로(버튼 2×2 wrap), 알림 드롭다운 폭 cap |
| `groups` | — | 모임 목록 `px-6`→`px-4 t:px-6` |

## 가장 차이가 큰 비교
- `find-account-m-before` ↔ `find-account-m-after` (모바일 카드 오버플로)
- `report-modal-m-before` ↔ `report-modal-m-after` (신고 모달 오버플로 → 버튼 wrap)
- `meeting-t-before` ↔ `meeting-t-after` (태블릿 가장자리 붙음)
- `notice-detail-t-before` ↔ `notice-detail-t-after` (공지 본문/댓글 정렬)

## 비고
- 검증 방식: 테스트 계정 로그인 + Playwright로 실제 dev 서버(prod 백엔드) 캡처.
- `setting-report`는 신고 데이터가 없어 항목 행 미렌더(코드 검증으로 대체).
- `notif-dropdown`은 364px 미만 폰에서만 폭 cap이 작동(390px에선 before/after 동일)하여 after만 보관.
