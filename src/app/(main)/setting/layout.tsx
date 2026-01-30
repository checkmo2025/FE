import Header from "@/components/layout/Header";
import SettingsSidebar from "@/components/base-ui/Settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background pb-[114px]">
      <div className="mx-auto flex w-full md:max-w-[768px] xl:max-w-[1440px] items-start justify-center gap-[30px] transition-all duration-300">
        {/* 사이드바 (왼쪽) */}
        <SettingsSidebar />

        {/* 컨텐츠 영역 (오른쪽) */}
        <section className="flex min-h-[700px] flex-1 flex-col items-start  ">
          {children}
        </section>
      </div>
    </main>
  );
}
