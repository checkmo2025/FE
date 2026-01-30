import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";

export default function VersionPage() {
  return (
    <div className="flex w-[1152px] flex-col items-start gap-[24px] pb-[314px] pl-[68px] pr-[400px]">
      {/* 1. 타이틀 영역 */}
      <SettingsTitle title="버전 정보" />

      {/* 2. 본문 영역 */}
      <div className="flex w-[688px] flex-col items-start gap-[40px] px-[20px]">
        {/* 콘텐츠 래퍼  */}
        <div className="flex flex-col items-start gap-[24px] self-stretch">
          {/* 버전 날짜 텍스트: Body_1.3, Gray_5 */}
          <p className="body_1_3 text-Gray-5">
            버전 업데이트 날짜 : 2026.01.01
          </p>
        </div>
      </div>
    </div>
  );
}
