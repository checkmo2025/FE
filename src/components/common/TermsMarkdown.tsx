import React from "react";

/**
 * 약관 전문(간이 마크다운: #, ##, ###, - )을 렌더링하는 공용 컴포넌트.
 * 회원가입 약관 상세 / 고객지원 정책 모달에서 공통으로 사용한다.
 */
export default function TermsMarkdown({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={index}
              className="text-Gray-6 font-sans text-[20px] md:text-[24px] font-bold leading-[135%] tracking-[-0.02px] mb-[16px]"
            >
              {trimmed.replace("# ", "")}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="text-Gray-6 font-sans text-[18px] md:text-[20px] font-semibold leading-[135%] tracking-[-0.02px] mb-[12px] mt-[8px]"
            >
              {trimmed.replace("## ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-Gray-6 font-sans text-[16px] md:text-[18px] font-semibold leading-[135%] tracking-[-0.018px] mb-[8px] mt-[4px]"
            >
              {trimmed.replace("### ", "")}
            </h3>
          );
        }
        if (trimmed.startsWith("- ")) {
          return (
            <div
              key={index}
              className="flex gap-[8px] pl-[4px] mb-[4px] text-Gray-6 font-sans text-[14px] md:text-[18px] font-medium leading-[145%] md:leading-[135%] tracking-[-0.018px]"
            >
              <span className="shrink-0">•</span>
              <span>{trimmed.replace("- ", "")}</span>
            </div>
          );
        }
        if (trimmed === "") return <div key={index} className="h-[1em]" />;
        return (
          <p
            key={index}
            className="text-Gray-6 font-sans text-[14px] md:text-[18px] font-medium leading-[145%] md:leading-[135%] tracking-[-0.018px] mb-[8px]"
          >
            {line}
          </p>
        );
      })}
    </>
  );
}
