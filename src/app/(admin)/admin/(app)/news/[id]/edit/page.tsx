"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NewsNewForm from "@/components/base-ui/Admin/news/NewForm";
import Toast from "@/components/base-ui/Admin/Toast";
import {
  fetchAdminNewsDetail,
  updateAdminNewsWithImages,
  deleteAdminNews,
} from "@/lib/api/admin/news";

type CarouselType = "PROMOTION" | "GENERAL";

type ExtraImageItem =
  | { type: "existing"; url: string }
  | { type: "new"; file: File; previewUrl: string };

export default function AdminNewsEditPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = Number(params.id);

  const [requesterEmail, setRequesterEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalLink, setOriginalLink] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [carousel, setCarousel] = useState<CarouselType>("PROMOTION");

  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const [repFile, setRepFile] = useState<File | null>(null);
  const [repPreview, setRepPreview] = useState<string | null>(null);

  const [extraImages, setExtraImages] = useState<ExtraImageItem[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const closeToast = () => {
    setToastMessage("");
  };

  const isImageFile = (file: File) => file.type.startsWith("image/");

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
        setRepPreview(news.thumbnailUrl || null);

        setExtraImages(
          (news.imageUrls ?? []).map((url: string) => ({
            type: "existing",
            url,
          }))
        );
      } catch (err) {
        console.error(err);
        alert("소식 상세 조회 실패");
        router.push("/admin/news");
      }
    };

    loadNewsDetail();
  }, [newsId, router]);

  useEffect(() => {
    return () => {
      if (repPreview && repPreview.startsWith("blob:")) {
        URL.revokeObjectURL(repPreview);
      }

      extraImages.forEach((image) => {
        if (image.type === "new") {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, [repPreview, extraImages]);

  const onPickRepImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      setToastMessage("이미지 파일 형식 오류");
      e.target.value = "";
      return;
    }

    setRepFile(file);

    setRepPreview((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(file);
    });

    e.target.value = "";
  };

  const onPickExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const hasInvalidFile = files.some((file) => !isImageFile(file));
    if (hasInvalidFile) {
      setToastMessage("이미지 파일 형식 오류");
      e.target.value = "";
      return;
    }

    setExtraImages((prev) => {
      const remaining = Math.max(0, 5 - prev.length);
      const selected = files.slice(0, remaining);

      const newItems: ExtraImageItem[] = selected.map((file) => ({
        type: "new",
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      return [...prev, ...newItems];
    });

    e.target.value = "";
  };

  const removeExtraAt = (idx: number) => {
    setExtraImages((prev) => {
      const target = prev[idx];

      if (target?.type === "new") {
        URL.revokeObjectURL(target.previewUrl);
      }

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
      setToastMessage("게시 날짜 오류");
      return;
    }

    const today = new Date();
    const end = new Date(parsed.publishEndAt);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const existingImageUrls = extraImages
      .filter(
        (image): image is { type: "existing"; url: string } =>
          image.type === "existing"
      )
      .map((image) => image.url);

    const imageFiles = extraImages
      .filter(
        (image): image is { type: "new"; file: File; previewUrl: string } =>
          image.type === "new"
      )
      .map((image) => image.file);

    try {
      setSubmitting(true);

      if (end < today) {
        const res = await deleteAdminNews(newsId);

        if (!res.isSuccess) {
          throw new Error(res.message || "소식 삭제 실패");
        }

        alert("게시 종료일이 지나 소식이 삭제되었습니다.");
        router.push("/admin/news");
        router.refresh();
        return;
      }

      const res = await updateAdminNewsWithImages(newsId, {
        title: title.trim(),
        requesterEmail: requesterEmail.trim(),
        content: content.trim(),
        originalLink: originalLink.trim(),
        publishStartAt: parsed.publishStartAt,
        publishEndAt: parsed.publishEndAt,
        carousel,
        thumbnailFile: repFile,
        imageFiles,
        existingThumbnailUrl: existingThumbnailUrl ?? undefined,
        existingImageUrls,
        uploadType: "NOTICE",
      });

      if (!res.isSuccess) throw new Error(res.message || "소식 수정 실패");

      setToastMessage("소식 수정 성공");

      setTimeout(() => {
        router.push(`/admin/news/${newsId}`);
        router.refresh();
      }, 500);
    } catch (err) {
      console.error(err);
      setToastMessage("소식 수정 실패");
    } finally {
      setSubmitting(false);
    }
  };

  const extraPreviews = extraImages.map((image) =>
    image.type === "existing" ? image.url : image.previewUrl
  );

  return (
    <>
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

      {toastMessage && (
        <Toast message={toastMessage} onClose={closeToast} />
      )}
    </>
  );
}