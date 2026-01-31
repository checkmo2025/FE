// src/app/(main)/settings/terms/page.tsx
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import TermItem from "@/components/base-ui/Settings/Terms/TermItem";
import { TERMS_DATA } from "@/constants/setting/terms";

export default function TermsPage() {
  return (
    // 전체 컨테이너
    <div
      className="flex flex-col items-start gap-[24px] pb-[73px]
      w-full md:w-[480px] md:px-0
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 타이틀 영역 */}
      <SettingsTitle title="이용약관" />

      {/* 2. 본문 영역 */}
      <div
        className="flex flex-col items-start gap-[40px] px-[20px]
        w-full md:w-[480px]
        xl:w-[688px]"
      >
        {/* 약관 리스트 컨테이너 */}
        <div className="flex flex-col items-start gap-[24px] self-stretch">
          {TERMS_DATA.map((term, index) => (
            <TermItem key={index} title={term.title} content={term.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
