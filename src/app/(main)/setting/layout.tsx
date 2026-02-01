import Header from "@/components/layout/Header";
import SettingsSidebar from "@/components/base-ui/Settings/SettingsSidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background pb-[114px]">
      {/*  메인 컨텐츠 래퍼 */}
      {/* 모바일: w-full */}
      {/* 태블릿/데스크탑: max-w 지정 및 중앙 정렬 */}
      <div
        className="mx-auto flex w-full md:max-w-[768px] xl:max-w-[1440px] items-start justify-center transition-all duration-300
        md:gap-[30px] "
      >
        {/* 사이드바 (왼쪽) - 모바일(md 미만)에서는 숨김 */}
        <div className="hidden md:block">
          <SettingsSidebar />
        </div>

        {/* 컨텐츠 영역 (오른쪽) */}
        {/* 모바일: w-full, 스타일 없음 */}
        {/* 태블릿 이상: 흰색 카드 스타일 적용 */}
        <section
          className="flex min-h-[700px] flex-1 flex-col items-start w-full
          md:rounded-[12px] "
        >
          {children}
        </section>
      </div>

      {/* 3. 하단 네비게이션 (모바일 전용) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
