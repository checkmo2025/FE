# Responsive Layout Audit Report – Next.js (App Router) Frontend

**Date:** 2026-06-23  
**Project:** /Users/hy/Desktop/checkmo_rn/ref_code/FE  
**Tailwind Breakpoints:** `t:` (768px), `d:` (1440px) | Convention: `px-4 t:px-6 max-w-[1400px] mx-auto`

---

## Standard Convention Summary

**Primary Container Pattern (CORRECT):**
```
mx-auto w-full max-w-[1400px] px-4 t:px-6
```
- Mobile: 16px horizontal padding
- Tablet (768px+): 24px horizontal padding
- Max-width: 1400px
- Centered with mx-auto

**Content Wrapper Pattern (CORRECT):**
```
w-full max-w-[1040px] mx-auto (or inline)
```
- Used for inner content sections
- Often paired with `px-4 t:px-6` for full-width sections

**Profile/Settings Pattern (INCONSISTENT):**
```
px-4 md:px-0  (WRONG: uses md: instead of t:)
```
- Should be: `px-4 t:px-0`

---

## Flagged Issues

### CRITICAL: Padding Removal on Tablet (t:px-0)

These pages have **ZERO padding on tablet**, causing text to touch screen edges:

#### 1. **MeetingPageClient** – THREE locations
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/groups/[id]/bookcase/[bookId]/meeting/MeetingPageClient.tsx`
- **Line 430:** `<div className="w-full max-w-[1040px] px-5 t:px-0 py-6">`
  - **Issue:** `px-5` on mobile, `t:px-0` removes padding entirely on tablet
  - **Neighbors:** NewsDetailClient uses `px-4 t:px-6`, StoryDetailClient uses `px-4` (no tablet fix)
  - **Fix:** Change to `px-5 t:px-6` or `px-4 t:px-6`

- **Line 442:** `<div className="w-full max-w-[1040px] px-5 t:px-0 py-6">`
  - **Issue:** Same as line 430

- **Line 453:** `<div className="w-full max-w-[1040px] px-5 t:px-0 py-6 flex flex-col gap-[16px]">`
  - **Issue:** Same as line 430

---

### CRITICAL: No Padding on Root Container

#### 2. **GroupsPageClient**
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/groups/GroupsPageClient.tsx`
- **Line 177:** `<div className="max-w-[1440px] flex flex-col gap-6 d:flex-row mt-3 sm:mt-5 d:mt-6 mx-auto px-6">`
  - **Issue:** Uses `px-6` with NO `t:px-` variant – tablet has hardcoded desktop padding (24px)
  - **Standard:** `mx-auto w-full max-w-[1400px] px-4 t:px-6`
  - **Fix:** Add mobile `px-4` and clarify breakpoints: `mx-auto w-full max-w-[1440px] px-4 t:px-6 d:px-6`

---

### INCONSISTENCY: No Tablet Padding Variant

#### 3. **StoryDetailClient** – TWO locations
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/stories/[id]/StoryDetailClient.tsx`

- **Line 94:** `<div className="relative mx-auto w-full max-w-[1400px] px-4">`
  - **Issue:** Mobile `px-4`, NO tablet variant
  - **Standard:** `px-4 t:px-6`
  - **Status:** Top-level wrapper (should have tablet breakpoint)

- **Line 136:** `<div className="t:border-t-2 border-Gray-1 w-full max-w-[1040px] px-5 t:mx-auto t:mt-10 pt-6">`
  - **Issue:** Mobile `px-5`, NO tablet variant
  - **Standard:** `px-4 t:px-6` or `px-5 t:px-6`
  - **Note:** Has `t:mx-auto` but missing `t:px-` variant

- **Line 142:** `<div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-5 mt-10 pt-6 pb-10">`
  - **Issue:** Fixed `px-5` (no breakpoints)
  - **Standard:** `px-4 t:px-6`

---

#### 4. **NoticeDetailPageClient**
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/groups/[id]/notice/[noticeId]/NoticeDetailPageClient.tsx`

- **Line 75:** `<div className="relative mx-auto w-full max-w-[1400px] px-[18px]">`
  - **Issue:** Odd padding value `px-[18px]`, NO tablet breakpoint
  - **Standard:** `px-4 t:px-6` (16/24px, not 18px)

- **Line 77:** `<div className="w-full max-w-[1040px] px-0 t:mx-auto pt-6">`
  - **Issue:** `px-0` on mobile (zero padding!), only `t:mx-auto` on tablet
  - **Standard:** `px-4 t:px-6` or `t:px-0` (intentional collapse only on tablet/desktop)

- **Line 94:** `<div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-[18px] mt-10 pt-6 pb-10">`
  - **Issue:** Odd padding value `px-[18px]`, NO tablet breakpoint

---

#### 5. **SearchPageClient**
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/search/SearchPageClient.tsx`

- **Line 100:** `<div className="max-w-[1040px] mx-auto t:px-8 min-h-screen">`
  - **Issue:** NO mobile `px-` value, only `t:px-8` on tablet (32px, unusually large)
  - **Standard:** `px-4 t:px-6`
  - **Problem:** Mobile viewport will have default/inherited padding

---

#### 6. **NoticePageClient**
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/groups/[id]/notice/NoticePageClient.tsx`
- **Line 75:** `<div className="w-full relative t:mx-3">`
  - **Issue:** ONLY `t:mx-3` on tablet, NO mobile or desktop padding/margin variants
  - **Standard:** `px-4 t:px-6 d:px-0` or similar
  - **Problem:** Tablet has 12px margin only; mobile completely uncontrolled

---

### POTENTIAL: Wrong Breakpoint Prefix

#### 7. **MypageClient**
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/profile/mypage/MypageClient.tsx`
- **Line 35:** `<div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 gap-[24px] mt-[10px] md:mt-[72px]">`
  - **Issue:** Uses Tailwind's default `md:` breakpoint (768px) instead of project's `t:` breakpoint
  - **Also at:** `/src/app/(main)/profile/[nickname]/ProfileClient.tsx:34` (same pattern)
  - **Standard:** Should be `px-4 t:px-0` (no padding on tablet+)
  - **But:** Code uses `md:` which is a different breakpoint than `t:`

---

#### 8. **ProfileClient** (Other User Profile)
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/profile/[nickname]/ProfileClient.tsx`
- **Line 34:** `<div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 gap-[24px] mt-[10px] md:mt-[72px]">`
  - **Issue:** Same as MypageClient – uses `md:` instead of `t:`

---

#### 9. **NicknameFollowsClient & MypageFollowsClient**
- **Files:** 
  - `/src/app/(main)/profile/[nickname]/follows/NicknameFollowsClient.tsx:89`
  - `/src/app/(main)/profile/mypage/follows/MypageFollowsClient.tsx:89`
- **Issue:** Same `px-4 md:px-0` pattern

---

### POTENTIAL: Odd Padding Values

#### 10. **CreateGroupPageClient**
- **File:** `/Users/hy/Desktop/checkmo_rn/ref_code/FE/src/app/(main)/groups/create/CreateGroupPageClient.tsx`
- **Line 227:** `<div className="w-full max-w-[1040px] mx-auto px-6 t:px-10 pt-6 pb-16">`
  - **Issue:** `px-6` (24px) mobile → `t:px-10` (40px) tablet – unusually large jump
  - **Standard:** `px-4 t:px-6` (16→24px) or `px-6 t:px-6` (consistent)
  - **Unusual:** Why increase padding on smaller (tablet) screen?

---

### COMPLETE INVENTORY TABLE

| Route | File | Line | Class | Issue | Neighbor Standard |
|-------|------|------|-------|-------|-------------------|
| **/home** | HomePageClient.tsx | 30 | `mx-auto w-full max-w-[1400px] px-4 t:px-6` | ✅ CORRECT | Standard |
| **/news** | NewsPageClient.tsx | 49 | `mx-auto w-full max-w-[1400px] px-4` | ⚠️ Missing `t:px-6` | Standard |
| **/news/[id]** | NewsDetailClient.tsx | 120 | `mx-auto w-full max-w-[1040px] px-4 t:px-6` | ✅ CORRECT | Standard |
| **/groups** | GroupsPageClient.tsx | 177 | `max-w-[1440px] ... mx-auto px-6` | 🔴 No mobile `px-4` | Standard |
| **/groups/[id]** | GroupDetailClient.tsx | 109 | `t:mx-auto d:mx-0 w-full max-w-[1024px] t:px-3 d:px-0` | ⚠️ Complex logic | Non-standard |
| **/groups/[id]/notice** | NoticePageClient.tsx | 75 | `w-full relative t:mx-3` | 🔴 Only `t:mx-3` | Standard |
| **/groups/[id]/notice/[noticeId]** | NoticeDetailPageClient.tsx | 75, 77, 94 | `px-[18px]`, `px-0 t:mx-auto`, `px-[18px]` | 🔴 Odd values, no variants | Standard |
| **/groups/[id]/bookcase/[bookId]/meeting** | MeetingPageClient.tsx | 430, 442, 453 | `w-full max-w-[1040px] px-5 t:px-0 py-6` | 🔴 REMOVES padding on tablet | Standard |
| **/stories** | StoriesPageClient.tsx | 157 | `mx-auto w-full max-w-[1400px] px-4` | ⚠️ Missing `t:px-6` | Standard |
| **/stories/[id]** | StoryDetailClient.tsx | 94, 136, 142 | `px-4` / `px-5 t:mx-auto` / `px-5` | 🔴 Missing tablet variant | `px-4 t:px-6` |
| **/stories/[id]/edit** | StoryEditPageClient.tsx | 104 | `mx-auto w-full max-w-[1400px] px-4` | ⚠️ Missing `t:px-6` | Standard |
| **/stories/new** | StoryNewPageClient.tsx | 82 | `mx-auto w-full max-w-[1400px] px-4` | ⚠️ Missing `t:px-6` | Standard |
| **/search** | SearchPageClient.tsx | 100 | `max-w-[1040px] mx-auto t:px-8` | 🔴 No mobile px, oversized tablet | Standard |
| **/books/[id]** | BookDetailClient.tsx | 64 | `mx-auto px-4 py-6 t:px-6 t:py-8` | ✅ CORRECT (has py) | Standard |
| **/profile/[nickname]** | ProfileClient.tsx | 34 | `px-4 md:px-0` | 🔴 Wrong breakpoint prefix | `px-4 t:px-0` |
| **/profile/mypage** | MypageClient.tsx | 35 | `px-4 md:px-0` | 🔴 Wrong breakpoint prefix | `px-4 t:px-0` |
| **/groups/create** | CreateGroupPageClient.tsx | 227 | `px-6 t:px-10` | ⚠️ Unusual padding increase | `px-6 t:px-6` |

---

## Summary of Issues

### By Severity

**🔴 CRITICAL (Padding Removal):**
- MeetingPageClient: `t:px-0` removes padding on tablet (3 occurrences)

**🔴 CRITICAL (Missing Padding):**
- GroupsPageClient: `px-6` only, no mobile `px-4`
- NoticePageClient: `t:mx-3` only – completely uncontrolled mobile layout
- NoticeDetailPageClient: `px-0` and `px-[18px]` (odd value)
- SearchPageClient: No mobile `px-`, only `t:px-8`

**⚠️ MEDIUM (Missing Tablet Variant):**
- StoryDetailClient (3 locations): `px-4` or `px-5` with no `t:px-6`
- NewsPageClient, StoriesPageClient, StoryEditPageClient, StoryNewPageClient: Missing `t:px-6`

**⚠️ MEDIUM (Wrong Breakpoint):**
- ProfileClient, MypageClient, ProfileFollowsClients: Use `md:` instead of `t:`

---

## Recommended Fixes

### Priority 1: Fix Padding Removal
1. **MeetingPageClient** (Lines 430, 442, 453)
   - Change: `px-5 t:px-0` → `px-5 t:px-6` or `px-4 t:px-6`

### Priority 2: Fix Missing Padding
2. **GroupsPageClient** (Line 177)
   - Change: `px-6` → `px-4 t:px-6` or `px-6 t:px-6`

3. **NoticePageClient** (Line 75)
   - Change: `t:mx-3` → `px-4 t:px-6` or `t:px-6`

4. **NoticeDetailPageClient** (Lines 75, 77, 94)
   - Change: `px-[18px]` → `px-4 t:px-6`
   - Change: `px-0 t:mx-auto` → `px-4 t:px-6`

5. **SearchPageClient** (Line 100)
   - Change: `t:px-8` → `px-4 t:px-6`

### Priority 3: Add Tablet Variants
6. **StoryDetailClient** (Lines 94, 136, 142)
   - Add: `t:px-6` to all `px-4` and `px-5` instances

7. **Other pages** (NewsPageClient, StoriesPageClient, etc.)
   - Add: `t:px-6` where missing

### Priority 4: Fix Breakpoint Prefix
8. **ProfileClient & Related** (ProfileClient, MypageClient, Follows pages)
   - Change: `md:px-0` → `t:px-0` (or confirm if intentional)

---

## Testing Checklist

- [ ] MeetingPageClient: Test tablet (768px) layout – text should not touch edges
- [ ] GroupsPageClient: Test mobile (360px) and tablet (768px) padding
- [ ] NoticeDetailPageClient: Verify padding at all breakpoints
- [ ] SearchPageClient: Confirm mobile padding applied
- [ ] All profile pages: Verify `t:` breakpoint applies correctly
- [ ] Create group flow: Confirm padding consistency across steps

