// src/app/(main)/settings/terms/page.tsx
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import TermItem from "@/components/base-ui/Settings/Terms/TermItem";
import { TERMS_DATA } from "@/constants/setting/terms";

export default function TermsPage() {
  return (
    <div className="flex w-[1152px] flex-col items-start gap-[24px] pb-[73px] pl-[68px] pr-[400px]">
      {/* 1. 타이틀 영역 */}
      <SettingsTitle title="이용약관" />

      {/* 2. 본문 영역 */}
      <div className="flex w-[688px] flex-col items-start gap-[40px] px-[20px]">
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
