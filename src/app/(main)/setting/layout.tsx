import Header from "@/components/layout/Header";
import SettingsSidebar from "@/components/base-ui/Settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#F9F7F6] pb-[114px]">
      <div className="mx-auto flex w-full max-w-[1440px] items-start justify-center gap-[30px]">
        {/* 왼쪽 사이드바 고정 */}
        <SettingsSidebar />

        {/* 오른쪽 가변 컨텐츠 영역 */}
        <section className="flex min-h-[700px] flex-1 flex-col items-start rounded-[12px] bg-white p-[40px] shadow-sm">
          {children}
        </section>
      </div>
    </main>
  );
}
