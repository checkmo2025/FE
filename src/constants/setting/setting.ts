export const SETTINGS_MENU = [
  {
    category: "계정 관리",
    icon: "/Setting_Profile.svg",
    items: [
      { label: "프로필 편집", href: "/setting/profile" },
      { label: "이메일 변경", href: "/setting/email" },
      { label: "비밀번호 변경", href: "/setting/password" },
      { label: "소셜 로그인/탈퇴/비활성화", href: "/setting/account-status" },
    ],
  },
  {
    category: "서비스",
    icon: "/Setting_Smile_emoji.svg",
    items: [
      { label: "내 소식 관리", href: "/setting/news" },
      { label: "신고 관리", href: "/setting/report" },
      { label: "알림 관리", href: "/setting/notifications" },
    ],
  },
  {
    category: "기타",
    icon: "/Category.svg",
    items: [
      { label: "고객센터/문의하기", href: "/setting/support" },
      { label: "이용약관", href: "/setting/terms" },
      { label: "버전 정보", href: "/setting/version" },
      { label: "로그아웃", href: "/setting/logout" },
    ],
  },
] as const;
