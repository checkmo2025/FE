"use client";

import { usePathname } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <AdminHeader />}
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}