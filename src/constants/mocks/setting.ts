// src/constants/settings.ts
export const SETTINGS_MENU = [
  {
    category: "계정 관리",
    icon: "/profile.svg",
    items: [
      { label: "프로필 편집", href: "/settings/profile" },
      { label: "이메일 변경", href: "/settings/email" },
      { label: "비밀번호 변경", href: "/settings/password" },
      { label: "소셜 로그인/탈퇴/비활성화", href: "/settings/account-status" },
    ],
  },
  {
    category: "서비스",
    icon: "/profile4.svg",
    items: [
      { label: "내 소식 관리", href: "/settings/news" },
      { label: "신고 관리", href: "/settings/reports" },
      { label: "알림 관리", href: "/settings/notifications" },
    ],
  },
  {
    category: "기타",
    icon: "/menu_dots.svg",
    items: [
      { label: "고객센터/문의하기", href: "/settings/support" },
      { label: "이용약관", href: "/settings/terms" },
      { label: "버전 정보", href: "/settings/version" },
      { label: "로그아웃", href: "/settings/logout" },
    ],
  },
] as const;
