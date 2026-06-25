"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import { authService } from "@/services/authService";

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

  // 관리자 권한 체크 추가
  useEffect(() => {
    if (isAuthPage) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const res = await authService.getLoginStatus();

        if (res.isSuccess && res.result?.admin) {
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
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <AdminHeader />}
      <div className="flex-1 bg-background">{children}</div>
    </div>
  );
}