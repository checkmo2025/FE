"use client";

import React, { useId, useState } from "react";
import { FieldLabel, UploadBox, UploadBoxMulti } from "./formParts";
import EmailSelectModal from "@/components/base-ui/Admin/news/EmailSelectModal";

type Props = {
  // 값들
  requesterEmail: string;
  title: string;
  content: string;
  dateRange: string;
  originalLink: string;

  // (선택) URL 기반 이미지
  thumbnailUrl?: string;
  imageUrlsText?: string;

  // setter들
  setRequesterEmail: (v: string) => void;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  setDateRange: (v: string) => void;
  setOriginalLink: (v: string) => void;

  setThumbnailUrl?: (v: string) => void;
  setImageUrlsText?: (v: string) => void;

  // 이미지 프리뷰/핸들러
  repPreview: string | null;
  extraPreviews: string[];
  onPickRepImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPickExtraImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeExtraAt: (idx: number) => void;

  // submit
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function NewForm({
  requesterEmail,
  title,
  content,
  dateRange,
  originalLink,

  setRequesterEmail,
  setTitle,
  setContent,
  setDateRange,
  setOriginalLink,

  repPreview,
  extraPreviews,
  onPickRepImage,
  onPickExtraImages,
  removeExtraAt,

  submitting,
  onSubmit,
}: Props) {
  const repImgId = useId();
  const extraImgId = useId();

  // 모달 open 상태 (NewForm 내부에서만 관리)
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <>
      <form
        className="mx-auto w-full max-w-[1040px] space-y-[40px]"
        onSubmit={onSubmit}
      >
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
            onClick={() => setEmailModalOpen(true)}
          >
            {requesterEmail ? requesterEmail : "선택하기"}
          </button>
        </div>

        {/* 소식 제목 */}
        <div className="space-y-3">
          <FieldLabel label="소식 제목" required />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              h-[56px] w-full rounded-[6px]
              border border-[var(--Subbrown_4)] bg-[var(--White)] px-4
              body_1_3 text-[var(--Gray_7)]
              placeholder:body_1_3 placeholder:text-[var(--Gray_3)]
              focus:outline-none focus:ring-2 focus:ring-[var(--Primary_1)]/20
            "
            placeholder="소식 제목을 입력해주세요 (최대 40자 이내)"
            maxLength={40}
          />
        </div>

        {/* 대표이미지 등록 */}
        <div className="space-y-3">
          <FieldLabel label="대표이미지 등록" />
          <UploadBox
            inputId={repImgId}
            preview={repPreview}
            onChange={onPickRepImage}
          />
        </div>

        {/* 기타이미지 등록 */}
        <div className="space-y-3">
          <FieldLabel label="기타이미지 등록" />
          <UploadBoxMulti
            inputId={extraImgId}
            previews={extraPreviews}
            onChange={onPickExtraImages}
            onRemove={removeExtraAt}
          />
        </div>

        {/* 소식 내용 */}
        <div className="space-y-3">
          <FieldLabel label="소식 내용" required />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="
              h-[720px] w-full resize-none rounded-[6px]
              border border-[var(--Subbrown_4)] bg-[var(--White)] p-4
              body_1_3 text-[var(--Gray_7)]
              placeholder:body_1_3 placeholder:text-[var(--Gray_3)]
              focus:outline-none focus:ring-2 focus:ring-[var(--Primary_1)]/20
            "
            placeholder="행사 일정, 장소, 주최 정보 등 이용자에게 전달하고 싶은 내용을 자유롭게 작성해주세요. (최대 5000자)"
            maxLength={5000}
          />
        </div>

        {/* 게시 요청 날짜 */}
        <div className="space-y-3">
          <FieldLabel label="게시 요청 날짜" required />
          <input
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
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

        {/* 원본 링크 */}
        <div className="space-y-3">
          <FieldLabel label="원본 링크" required />
          <input
            value={originalLink}
            onChange={(e) => setOriginalLink(e.target.value)}
            className="
              h-[56px] w-full rounded-[6px]
              border border-[var(--Subbrown_4)] bg-[var(--White)] px-4
              body_1_3 text-[var(--Gray_7)]
              placeholder:body_1_3 placeholder:text-[var(--Gray_3)]
              focus:outline-none focus:ring-2 focus:ring-[var(--Primary_1)]/20
            "
            placeholder="원본 URL을 입력해주세요"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="
              h-[48px] w-[148px] rounded-[8px]
              bg-[var(--Primary_1)]
              body_1 text-[var(--White)]
              hover:opacity-95
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {submitting ? "등록 중..." : "소식 등록"}
          </button>
        </div>
      </form>

      {/* Email 선택 모달 */}
      <EmailSelectModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSelect={(email: string) => {
          setRequesterEmail(email);
          setEmailModalOpen(false);
        }}
      />
    </>
  );
}