"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";

type LoginStatusResponse = {
  isSuccess: boolean;
  result?: {
    admin: boolean;
  };
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // 기존 조건 유지
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  // 어드민 진입 시 scrollbar-gutter: stable 적용 (페이지 이동 시 레이아웃 튐 방지)
  useEffect(() => {
    document.documentElement.style.scrollbarGutter = "stable";
    return () => {
      document.documentElement.style.scrollbarGutter = "";
    };
  }, []);

  // 관리자 권한 체크 추가
  useEffect(() => {
    if (isAuthPage) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/members/me/login-status`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }

        const data: LoginStatusResponse = await res.json();

        if (data.isSuccess && data.result?.admin) {
          setAuthorized(true);
        } else {
          router.replace("/admin/login");
        }
      } catch {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, isAuthPage]);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  // 권한 없으면 렌더링 막기
  if (!authorized) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <AdminHeader />}
      <div>{children}</div>
    </div>
  );
}