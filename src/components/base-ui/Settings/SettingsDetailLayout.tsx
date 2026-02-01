// src/components/base-ui/Settings/SettingsDetailLayout.tsx
"use client";

import SettingsTitle from "./SettingsTitle";
import MobileSettingHeader from "./MobileSettingHeader";

type Props = {
  title: string; // 헤더 타이틀
  children: React.ReactNode; // 본문 내용
  className?: string; // 본문 영역 추가 스타일
  mode?: "narrow" | "wide"; // narrow(기본, 폼 형태) vs wide(리스트, 와이드 형태)
};

export default function SettingsDetailLayout({
  title,
  children,
  className = "",
  mode = "narrow",
}: Props) {
  // 모드에 따른 데스크탑(xl) 스타일 분기
  const containerXlStyle =
    mode === "narrow"
      ? "xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]" // 우측 여백이 많은 폼 형태
      : "xl:w-[1152px] xl:px-[76px]"; // 좌우 균형이 맞는 와이드 형태

  const contentXlStyle =
    mode === "narrow"
      ? "xl:w-[688px]" // 폼 너비
      : "xl:w-full"; // 와이드 너비 (부모 패딩 따름)

  return (
    <div
      className={`flex flex-col items-start gap-[24px] pb-[100px] md:pb-[314px] w-full md:w-[480px] ${containerXlStyle}`}
    >
      {/* 1. 헤더 영역 */}
      <div className="flex flex-col w-full">
        <MobileSettingHeader title="뒤로가기" />
        <SettingsTitle title={title} />
      </div>

      {/* 2. 본문 영역 */}
      <div
        className={`
        flex flex-col items-start px-[20px] w-full
        md:w-[480px]
        ${contentXlStyle}
        ${className}
      `}
      >
        {children}
      </div>
    </div>
  );
}
