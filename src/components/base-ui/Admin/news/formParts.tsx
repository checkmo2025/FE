"use client";

import React from "react";

export function FieldLabel({
  label,
  required,
  className = "",
}: {
  label: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 subhead_4_1 text-[var(--Gray_7)] ${className}`}>
      <span>{label}</span>
      {required ? <span className="text-[var(--Red)]">*</span> : null}
    </div>
  );
}

export function UploadBox({
  inputId,
  preview,
  onChange,
}: {
  inputId: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input id={inputId} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <label
        htmlFor={inputId}
        className="
          flex h-[56px] w-full cursor-pointer items-center justify-center
          rounded-[8px] border border-[var(--Subbrown_4)] bg-[var(--Gray_1)]
          hover:opacity-95
        "
        title="이미지 선택"
      >
        {preview ? (
          <div className="flex items-center gap-3 px-4">
            <div className="h-8 w-8 overflow-hidden rounded bg-[var(--White)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            </div>
            <span className="body_1_3 text-[var(--Gray_7)]">이미지 선택됨 (변경하려면 클릭)</span>
          </div>
        ) : (
          <PlusIcon />
        )}
      </label>
    </div>
  );
}

export function UploadBoxMulti({
  inputId,
  previews,
  onChange,
  onRemove,
}: {
  inputId: string;
  previews: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (idx: number) => void;
}) {
  const count = previews.length;
  const disabled = count >= 5;

  return (
    <div className="relative">
      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onChange}
        disabled={disabled}
      />

      <label
        htmlFor={inputId}
        className="
          flex w-full cursor-pointer items-center justify-center
          rounded-[8px] border border-[var(--Subbrown_4)] bg-[var(--Gray_1)]
          hover:opacity-95
          h-[56px] px-4 py-3
        "
        title="이미지 선택"
      >
        {count === 0 ? (
          <PlusIcon />
        ) : (
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {previews.slice(0, 5).map((src, idx) => (
                <div key={`${src}-${idx}`} className="relative h-10 w-10 shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded bg-[var(--White)] border border-[var(--Subbrown_4)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`extra-${idx}`} className="h-full w-full object-cover" />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove(idx);
                    }}
                    className="
                      absolute -right-2 -top-2 h-5 w-5 rounded-full
                      bg-[var(--Black)]/80 text-[var(--White)]
                      flex items-center justify-center text-[12px]
                    "
                    aria-label="remove"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="shrink-0 body_1_3 text-[var(--Gray_7)]">
              {disabled ? `최대 5개` : `추가하기 (${count}/5)`}
            </div>
          </div>
        )}
      </label>
    </div>
  );
}

export function PlusIcon() {
  return <span className="text-[40px] font-thin leading-none text-[var(--Black)]">+</span>;
}