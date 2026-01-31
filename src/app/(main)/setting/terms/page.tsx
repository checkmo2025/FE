// src/app/(main)/settings/terms/page.tsx
import MobileSettingHeader from "@/components/base-ui/Settings/MobileSettingHeader";
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import TermItem from "@/components/base-ui/Settings/Terms/TermItem";
import { TERMS_DATA } from "@/constants/setting/terms";

export default function TermsPage() {
  return (
    // 전체 컨테이너
    <div
      className="flex flex-col items-start gap-[24px] pb-[73px]
      w-full md:w-[480px]
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 헤더 영역 */}
      <div className="flex flex-col w-full">
        {/* 모바일: 뒤로가기 헤더 */}
        <MobileSettingHeader title="뒤로가기" />

        {/* 타이틀 (모바일: 1px border / PC: 2px border - SettingsTitle 내부 처리됨) */}
        <SettingsTitle title="이용약관" />
      </div>

      {/* 2. 본문 영역 */}
      {/* 모바일: padding 0 20px, gap 40px */}
      <div
        className="flex flex-col items-start gap-[40px] px-[20px]
        w-full md:w-[480px]
        xl:w-[688px]"
      >
        {/* 약관 리스트 컨테이너 */}
        {/* 명세 Frame 2087328540: gap 24px */}
        <div className="flex flex-col items-start gap-[24px] self-stretch">
          {TERMS_DATA.map((term, index) => (
            <TermItem key={index} title={term.title} content={term.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
