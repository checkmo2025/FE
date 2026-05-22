"use client";

import { useEffect, useRef } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from "@/components/layout/Header";
import SettingsSidebar from "@/components/base-ui/Settings/SettingsSidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function SettingsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized, isLoggedIn } = useAuthGuard();

  if (!isInitialized || !isLoggedIn) {
    return null;
  }
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background pb-[114px]">
      <div
        className="mx-auto flex w-full md:max-w-[768px] xl:max-w-[1440px] items-start justify-center transition-all duration-300
        md:gap-[30px] "
      >
        <div className="hidden md:block">
          <SettingsSidebar />
        </div>

        <section
          className="flex min-h-[700px] flex-1 flex-col items-start w-full
          md:rounded-[12px] "
        >
          {children}
        </section>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
