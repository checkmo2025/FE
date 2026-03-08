"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAdminNewsWithImages,
} from "@/lib/api/admin/news";
import NewsNewForm from "@/components/base-ui/Admin/news/NewForm";

export default function AdminNewsNewPage() {
  const router = useRouter();

  // 폼 상태
  const [requesterEmail, setRequesterEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalLink, setOriginalLink] = useState("");
  const [dateRange, setDateRange] = useState("");

  // 파일 상태(업로드용)
  const [repFile, setRepFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

  // UI용(미리보기)
  const [repPreview, setRepPreview] = useState<string | null>(null);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const onPickRepImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 업로드용 파일 저장
    setRepFile(file);

    // 미리보기
    setRepPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    e.target.value = "";
  };

  const onPickExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // ✅ 최대 5장
    const merged = [...extraFiles, ...files].slice(0, 5);

    // 기존 preview 정리
    extraPreviews.forEach((u) => URL.revokeObjectURL(u));

    // merged 기준으로 다시 생성
    const previews = merged.map((f) => URL.createObjectURL(f));

    setExtraFiles(merged);
    setExtraPreviews(previews);

    e.target.value = "";
  };

  const removeExtraAt = (idx: number) => {
    setExtraFiles((prev) => prev.filter((_, i) => i !== idx));
    setExtraPreviews((prev) => {
      const target = prev[idx];
      if (target) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const parseDateRange = (v: string) => {
    const raw = v.trim();
    const parts = raw.split("~").map((s) => s.trim());
    if (parts.length !== 2) return null;

    const toISO = (s: string) => s.replaceAll("/", "-");
    const publishStartAt = toISO(parts[0]);
    const publishEndAt = toISO(parts[1]);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishStartAt)) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishEndAt)) return null;

    return { publishStartAt, publishEndAt };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!requesterEmail.trim()) return alert("회원 이메일을 입력해주세요.");
    if (!title.trim()) return alert("소식 제목을 입력해주세요.");
    if (!content.trim()) return alert("소식 내용을 입력해주세요.");
    if (!originalLink.trim()) return alert("원본 링크를 입력해주세요.");

    const parsed = parseDateRange(dateRange);
    if (!parsed) {
      return alert("게시 요청 날짜 형식이 올바르지 않아요. (YYYY/MM/DD~YYYY/MM/DD)");
    }

    try {
      setSubmitting(true);

      // S3 업로드 + POST 한번에 처리
      const res = await createAdminNewsWithImages({
        title: title.trim(),
        requesterEmail: requesterEmail.trim(),
        content: content.trim(),
        originalLink: originalLink.trim(),
        publishStartAt: parsed.publishStartAt,
        publishEndAt: parsed.publishEndAt,

        thumbnailFile: repFile, // 대표이미지
        imageFiles: extraFiles, // 기타이미지
        uploadType: "NOTICE",
      });

      if (!res.isSuccess) throw new Error(res.message || "소식 등록 실패");

      alert(`소식 등록 완료! (ID: ${res.result})`);
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("소식 등록 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto w-full px-6 py-10">
        <div className="rounded-[12px] bg-transparent">
          <NewsNewForm
            requesterEmail={requesterEmail}
            title={title}
            content={content}
            dateRange={dateRange}
            originalLink={originalLink}
            setRequesterEmail={setRequesterEmail}
            setTitle={setTitle}
            setContent={setContent}
            setDateRange={setDateRange}
            setOriginalLink={setOriginalLink}
            repPreview={repPreview}
            extraPreviews={extraPreviews}
            onPickRepImage={onPickRepImage}
            onPickExtraImages={onPickExtraImages}
            removeExtraAt={removeExtraAt}
            submitting={submitting}
            onSubmit={onSubmit}
          />
        </div>
      </section>
    </main>
  );
}