"use client";

import { usePathname } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Auth 페이지인지 체크
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <AdminHeader />}
      <main className="flex-1 bg-[#F9F7F6]">{children}</main>
    </div>
  );
}