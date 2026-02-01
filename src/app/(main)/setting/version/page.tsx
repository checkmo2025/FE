import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
export default function VersionPage() {
  return (
    <SettingsDetailLayout title="버전 정보" className="gap-[40px]">
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <p className="w-full text-Gray-5 text-[14px] font-normal leading-[145%] tracking-[-0.014px] md:body_1_3">
          버전 업데이트 날짜 : 2026.01.01
        </p>
      </div>
    </SettingsDetailLayout>
  );
}
