"use client";

import React, { useCallback, useLayoutEffect, useRef } from "react";

type BookstoryTextProps = {
  title: string;
  detail: string;
  onChangeTitle: (v: string) => void;
  onChangeDetail: (v: string) => void;
};

export default function BookstoryText({
  title,
  detail,
  onChangeTitle,
  onChangeDetail,
}: BookstoryTextProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ✅ 내용에 맞춰 textarea 높이 자동 조절
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px"; // 먼저 줄여서 scrollHeight 정확히 계산
    el.style.height = `${el.scrollHeight}px`;
  }, [detail]);

  // textarea에서 Tab을 "들여쓰기"로 처리
  const handleDetailKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Tab") return;

      e.preventDefault();

      const el = e.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;

      const insert = "  ";
      const next = detail.slice(0, start) + insert + detail.slice(end);

      onChangeDetail(next);

      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + insert.length;
      });
    },
    [detail, onChangeDetail]
  );

  return (
    <div
      className="
        flex w-full max-w-[1040px] min-h-[476px] p-[16px] flex-col
        rounded-[8px] border-2 border-[color:var(--Subbrown_4,#EAE5E2)]
        bg-[color:var(--White,#FFF)]
      "
    >
      {/* Title box */}
      <div className="flex p-[10px] items-center gap-[10px] border-b border-b-[color:var(--Subbrown_4,#EAE5E2)]">
        <input
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          className="
            w-full bg-transparent outline-none
            text-[color:var(--Gray_7,#2C2C2C)] Subhead_2
            placeholder:text-[color:var(--Gray_3,#BBB)]
          "
        />
      </div>

      {/* Detail box */}
      <div className="flex p-[10px] items-start gap-[10px]">
        <textarea
          ref={textareaRef}
          value={detail}
          onChange={(e) => onChangeDetail(e.target.value)}
          onKeyDown={handleDetailKeyDown}
          placeholder="내용을 자유롭게 입력해주세요."
          rows={6}
          className="
            w-full resize-none bg-transparent outline-none
            text-[color:var(--Gray_7,#2C2C2C)] Subhead_4_1
            placeholder:text-[color:var(--Gray_3,#BBB)]
            whitespace-pre-wrap
          "
        />
      </div>
    </div>
  );
}
