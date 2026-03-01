"use client";

import { useId, useState } from "react";

export default function AdminNewsNewPage() {
  const repImgId = useId();
  const extraImgId = useId();

  const [repPreview, setRepPreview] = useState<string | null>(null);
  const [extraPreview, setExtraPreview] = useState<string | null>(null);

  const onPickImage =
    (setter: (v: string | null) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setter(url);
    };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Content */}
      <section className="mx-auto w-full px-6 py-10">
        <div className="rounded-[12px] bg-transparent">
          <form className="mx-auto w-full max-w-[1040px] space-y-[40px]">
            {/* 회원 이메일 */}
            <div className="space-y-3">
              <FieldLabel label="회원 이메일" required />
              <button
                type="button"
                className="
                  h-[56px] w-full
                  rounded-[6px] border border-[var(--Subbrown_4)] bg-[var(--White)]
                  text-[18px] font-normal leading-[135%] tracking-[-0.018px]
                  text-[var(--Black)]
                  underline text-center
                  hover:bg-[var(--background)]
                "
              >
                선택하기
              </button>
            </div>

            {/* 소식 제목 */}
            <div className="space-y-3">
              <FieldLabel label="소식 제목" required />
              <input
                className="
                  h-[56px] w-full rounded-[6px]
                  border border-[var(--Subbrown_4)] bg-[var(--White)] px-4
                  body_1_3 text-[var(--Gray_7)]
                  placeholder:body_1_3 placeholder:text-[var(--Gray_3)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--Primary_1)]/20
                "
                placeholder="소식 제목을 입력해주세요 (최대 40자 이내)"
              />
            </div>

            {/* 대표이미지 등록 */}
            <div className="space-y-3">
              <FieldLabel label="대표이미지 등록" required />
              <UploadBox
                inputId={repImgId}
                preview={repPreview}
                onChange={onPickImage(setRepPreview)}
              />
            </div>

            {/* 기타이미지 등록 */}
            <div className="space-y-3">
              <FieldLabel label="기타이미지 등록" />
              <UploadBox
                inputId={extraImgId}
                preview={extraPreview}
                onChange={onPickImage(setExtraPreview)}
              />
            </div>

            {/* 프로모션 여부 */}
            <div className="space-y-3">
              <FieldLabel label="프로모션 여부" className="text-[var(--Gray_6)]" />
              <div className="flex items-center gap-3 body_1_3 text-[var(--Gray_6)]">
                <Radio name="promo" label="모임별" />
                <Radio name="promo" label="지역별" />
              </div>
            </div>

            {/* 소식 내용 */}
            <div className="space-y-3">
              <FieldLabel label="소식 내용" required />
              <textarea
                className="
                  h-[720px] w-full resize-none rounded-[6px]
                  border border-[var(--Subbrown_4)] bg-[var(--White)] p-4
                  body_1_3 text-[var(--Gray_7)]
                  placeholder:body_1_3 placeholder:text-[var(--Gray_3)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--Primary_1)]/20
                "
                placeholder="행사 일정, 장소, 주최 정보 등 이용자에게 전달하고 싶은 내용을 자유롭게 작성해주세요. (최대 5000자)"
              />
            </div>

            {/* 게시 요청 날짜 */}
            <div className="space-y-3">
              <FieldLabel label="게시 요청 날짜" required />
              <input
                className="
                  h-[56px] w-full rounded-[6px]
                  border border-[var(--Subbrown_4)] bg-[var(--White)] px-4
                  body_1_3 text-[var(--Gray_7)]
                  placeholder:body_1_3 placeholder:text-[var(--Gray_3)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--Primary_1)]/20
                "
                placeholder="형식 : YYYY/MM/DD~YYYY/MM/DD"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="
                  h-[48px] w-[148px] rounded-[8px]
                  bg-[var(--Primary_1)]
                  body_1 text-[var(--White)]
                  hover:opacity-95
                "
              >
                소식 등록
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function FieldLabel({
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

function Radio({ name, label }: { name: string; label: string }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 body_1_3 text-[var(--Gray_6)]">
      <input
        id={id}
        name={name}
        type="radio"
        className="h-4 w-4 accent-[var(--Primary_1)]"
      />
      <span>{label}</span>
    </label>
  );
}

function UploadBox({
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

function PlusIcon() {
  return (
    <span className="text-[40px] font-thin leading-none text-[var(--Black)]">
      +
    </span>
  );
}