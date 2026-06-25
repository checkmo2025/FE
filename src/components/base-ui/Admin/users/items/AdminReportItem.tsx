"use client";

import Link from "next/link";

type Props = {
  reason: string;
  content: string;
  targetLabel: string;
  targetUrl: string | null;
  targetAvailable: boolean;
  reportedAt: string;
};

export default function ReportItem({
  reason,
  content,
  targetLabel,
  targetUrl,
  targetAvailable,
  reportedAt,
}: Props) {
  // 안전한 내부 URL("/..."으로 시작, "//" 외부 링크 제외)만 열 수 있도록 보장.
  // 통과한 값은 string으로 좁혀져 next/link의 href 타입과 호환된다.
  const safeTargetUrl =
    targetAvailable &&
    targetUrl !== null &&
    targetUrl.startsWith("/") &&
    !targetUrl.startsWith("//")
      ? targetUrl
      : null;

  return (
    <div
      className="flex w-full flex-col gap-[16px] rounded-[8px] border border-Subbrown-4 bg-White p-[20px]
      md:flex-row md:items-start md:gap-[24px] xl:px-[28px]"
    >
      <div className="flex min-w-[72px] shrink-0 items-center justify-center rounded-[4px] bg-Red px-[8px] py-[4px]">
        <span
          className="text-White
          text-[12px] font-medium leading-[145%] tracking-[-0.012px]
          md:body_2_2"
        >
          {reason}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
        <div className="flex flex-col-reverse gap-[8px] md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="body_2_2 text-Gray-6">신고 내용</p>
            <p className="mt-[4px] whitespace-pre-wrap break-words body_2_3 text-Gray-5">
              {content}
            </p>
          </div>
          <span className="shrink-0 text-[12px] font-normal leading-[145%] tracking-[-0.012px] text-Gray-3 md:body_2_3">
            {reportedAt}
          </span>
        </div>

        <div className="min-w-0 border-t border-Subbrown-4 pt-[12px]">
          <p className="body_2_2 text-Gray-6">신고 대상</p>
          {safeTargetUrl ? (
            <Link
              href={safeTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="신고 대상 새 탭에서 열기"
              className="mt-[4px] inline-block break-all body_2_3 text-primary-1 underline underline-offset-2 hover:text-primary-3 focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
            >
              {targetLabel}
            </Link>
          ) : (
            <div className="mt-[4px]">
              <p className="break-words body_2_3 text-Gray-4">
                {targetLabel || "삭제되었거나 확인할 수 없는 대상"}
              </p>
              <p className="mt-[2px] text-[12px] text-Gray-3">
                대상 페이지 없음
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
