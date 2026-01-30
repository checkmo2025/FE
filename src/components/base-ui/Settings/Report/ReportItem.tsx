"use client";

import Image from "next/image";

type Props = {
  category: string;
  reporterName: string;
  content: string;
};

export default function ReportItem({ category, reporterName, content }: Props) {
  return (
    // Frame: setting_report_list
    <div className="flex w-full max-w-[1000px] items-start gap-[40px] rounded-[8px] border border-Subbrown-4 bg-White p-[20px]">
      {/* 신고 카테고리 뱃지 */}
      <div className="flex w-[60px] shrink-0 items-center justify-center gap-[10px] rounded-[4px] bg-[#FF5151] p-[4px]">
        <span className="body_2_2 text-White">{category}</span>
      </div>

      {/* 우측 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col items-start gap-[12px]">
        {/* 상단: 작성자 정보 */}
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-[8px]">
            {/* 프로필 이미지 */}
            <div className="relative h-[24px] w-[24px] shrink-0">
              <Image
                src="/profile.svg"
                alt="profile"
                fill
                className="object-cover rounded-full"
              />
            </div>
            {/* 닉네임 */}
            <span className="body_1_2 text-Gray-7">{reporterName}</span>
          </div>
        </div>

        {/* 하단: 신고 내용 텍스트 */}
        <p className="self-stretch whitespace-pre-wrap body_2_3 text-Gray-5">
          {content}
        </p>
      </div>
    </div>
  );
}
