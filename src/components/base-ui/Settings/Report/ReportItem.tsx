"use client";

import Image from "next/image";

type Props = {
  category: string;
  reporterName: string;
  content: string;
  date: string; // [추가] 날짜 필드
};

export default function ReportItem({
  category,
  reporterName,
  content,
  date,
}: Props) {
  return (
    // 전체 컨테이너
    // 태블릿(md): w-[440px] (부모 480px - 패딩 40px)
    // 데스크탑(xl): w-[1000px]
    <div
      className="flex items-start gap-[40px] rounded-[8px] border border-Subbrown-4 bg-White p-[20px]
      w-full md:w-[440px]
      xl:w-[1000px]"
    >
      {/* 신고 카테고리 뱃지: 60px */}
      <div className="flex w-[60px] shrink-0 items-center justify-center gap-[10px] rounded-[4px] bg-Red p-[4px]">
        {" "}
        <span className="body_2_2 text-White">{category}</span>
      </div>

      {/* 우측 콘텐츠 영역 */}
      {/* 태블릿(md): w-[280px] (명세 반영) */}
      {/* 데스크탑(xl): flex-1 (남은 공간 채움) */}
      <div
        className="flex flex-col items-start gap-[12px]
        w-[280px] xl:w-auto xl:flex-1"
      >
        {/* 상단: 작성자 정보 + 날짜 */}
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

          {/* [추가] 날짜 표시 (Body_2.3, Gray_3) */}
          <span className="body_2_3 text-Gray-3">{date}</span>
        </div>

        {/* 하단: 신고 내용 텍스트 */}
        <p className="self-stretch whitespace-pre-wrap body_2_3 text-Gray-5">
          {content}
        </p>
      </div>
    </div>
  );
}
