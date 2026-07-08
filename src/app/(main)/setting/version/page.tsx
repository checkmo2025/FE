import type { Metadata } from "next";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";

export const metadata: Metadata = {
  title: "버전 정보",
};
export default function VersionPage() {
  return (
    <SettingsDetailLayout title="버전 정보" className="gap-[40px]">
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <p className="w-full text-Gray-5 text-[14px] font-normal leading-[145%] tracking-[-0.014px] md:body_1_3">
          버전 업데이트 날짜 : 2026.07.08
        </p>
      </div>
    </SettingsDetailLayout>
  );
}
