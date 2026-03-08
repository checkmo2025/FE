"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NewsNewForm from "@/components/base-ui/Admin/news/NewForm";
import {
  fetchAdminNewsDetail,
  updateAdminNewsWithImages,
} from "@/lib/api/admin/news";

type CarouselType = "PROMOTION" | "GENERAL";

export default function AdminNewsEditPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = Number(params.id);

  // 폼 상태
  const [requesterEmail, setRequesterEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalLink, setOriginalLink] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [carousel, setCarousel] = useState<CarouselType>("PROMOTION");

  // 기존 이미지 URL 상태(서버에 다시 보낼 용도)
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // 파일 상태(업로드용)
  const [repFile, setRepFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

  // UI용(미리보기)
  const [repPreview, setRepPreview] = useState<string | null>(null);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (Number.isNaN(newsId)) return;

    const loadNewsDetail = async () => {
      try {
        const response = await fetchAdminNewsDetail(newsId);
        const news = response.result;

        setRequesterEmail(news.requesterEmail);
        setTitle(news.title);
        setContent(news.content);
        setOriginalLink(news.originalLink);
        setDateRange(
          `${news.publishStartAt.replaceAll("-", "/")}~${news.publishEndAt.replaceAll("-", "/")}`
        );
        setCarousel(news.carousel);

        setExistingThumbnailUrl(news.thumbnailUrl || null);
        setExistingImageUrls(news.imageUrls ?? []);

        setRepPreview(news.thumbnailUrl || null);
        setExtraPreviews(news.imageUrls ?? []);
      } catch (err) {
        console.error(err);
        alert("소식 상세 조회 실패");
        router.push("/admin/news");
      }
    };

    loadNewsDetail();
  }, [newsId, router]);

  const onPickRepImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRepFile(file);

    setRepPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    e.target.value = "";
  };

  const onPickExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const merged = [...extraFiles, ...files].slice(0, 5);

    extraPreviews.forEach((u) => {
      if (u.startsWith("blob:")) URL.revokeObjectURL(u);
    });

    const previews = merged.map((f) => URL.createObjectURL(f));

    setExtraFiles(merged);
    setExtraPreviews(previews);

    e.target.value = "";
  };

  const removeExtraAt = (idx: number) => {
    // 새로 추가한 파일 삭제
    setExtraFiles((prev) => prev.filter((_, i) => i !== idx));

    // 기존 URL/미리보기 삭제도 함께 반영
    setExtraPreviews((prev) => {
      const target = prev[idx];
      if (target && target.startsWith("blob:")) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== idx);
    });

    setExistingImageUrls((prev) => prev.filter((_, i) => i !== idx));
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

      const res = await updateAdminNewsWithImages(newsId, {
        title: title.trim(),
        requesterEmail: requesterEmail.trim(),
        content: content.trim(),
        originalLink: originalLink.trim(),
        publishStartAt: parsed.publishStartAt,
        publishEndAt: parsed.publishEndAt,
        carousel,
        thumbnailFile: repFile,
        imageFiles: extraFiles,
        existingThumbnailUrl: existingThumbnailUrl ?? undefined,
        existingImageUrls,
        uploadType: "NOTICE",
      });

      if (!res.isSuccess) throw new Error(res.message || "소식 수정 실패");

      alert("소식 수정 완료!");
      router.push(`/admin/news/${newsId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("소식 수정 실패");
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
            carousel={carousel}
            setRequesterEmail={setRequesterEmail}
            setTitle={setTitle}
            setContent={setContent}
            setDateRange={setDateRange}
            setOriginalLink={setOriginalLink}
            setCarousel={setCarousel}
            repPreview={repPreview}
            extraPreviews={extraPreviews}
            onPickRepImage={onPickRepImage}
            onPickExtraImages={onPickExtraImages}
            removeExtraAt={removeExtraAt}
            submitting={submitting}
            onSubmit={onSubmit}
            submitLabel="수정하기"
            submittingLabel="수정 중..."
          />
        </div>
      </section>
    </main>
  );
}