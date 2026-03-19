"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminNewsDetail,
  type AdminNewsDetailResult,
} from "@/lib/api/admin/news";

function getSafeImageSrc(
  src?: string | null,
  fallback: string = "/news_sample4.svg"
) {
  if (!src) return fallback;

  const trimmed = src.trim();

  if (!trimmed) return fallback;

  // Swagger 예시값이나 잘못된 문자열 방어
  if (
    trimmed === "string" ||
    trimmed === "null" ||
    trimmed === "undefined"
  ) {
    return fallback;
  }

  // next/image 에서 허용 가능한 경로만 통과
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return fallback;
}

export default function AdminNewsDetailPage() {
  const params = useParams();
  const newsId = Number(params.id);

  const [news, setNews] = useState<AdminNewsDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    if (Number.isNaN(newsId)) {
      setIsInvalid(true);
      setLoading(false);
      return;
    }

    let alive = true;

    const run = async () => {
      try {
        const response = await fetchAdminNewsDetail(newsId);

        if (!alive) return;

        if (!response.isSuccess) {
          setIsInvalid(true);
          return;
        }

        setNews(response.result);
      } catch (error) {
        if (!alive) return;
        setIsInvalid(true);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [newsId]);

  const thumbnailSrc = useMemo(() => {
    return getSafeImageSrc(news?.thumbnailUrl, "/news_sample4.svg");
  }, [news?.thumbnailUrl]);

  if (loading) {
  return <div className="text-center py-20">Loading...</div>;
  }

  if (isInvalid || !news) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <div className="relative w-screen h-[297px] t:h-[468px] overflow-hidden">
        <Image
          src={thumbnailSrc}
          alt={news.title || "소식 썸네일"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Main */}
      <div className="mx-auto w-full max-w-[1400px] px-9 t:px-[200px] mt-6 t:mt-10">
        <p className="body_2_2 text-Gray-4 mb-2">
          게시기간 {news.publishStartAt} - {news.publishEndAt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="subhead_1 t:headline_3 text-Gray-7">{news.title}</h1>
          <p className="body_1_2 text-Gray-3">{news.createdAt}</p>
        </div>

        {/* 본문 */}
        <div className="w-full max-w-[1040px] mt-22">
          <p className="body_1_3 t:subhead_3 text-Gray-6 whitespace-pre-wrap">
            {news.content}
          </p>
        </div>

        {/* 수정 버튼 */}
        <div className="w-full max-w-[1040px] mt-[72px] mb-[87px]">
          <Link
            href={`/admin/news/${news.newsId}/edit`}
            className="
              inline-flex items-center
              w-[120px] h-[40px]
              rounded
              bg-primary-1
              text-White
              text-[14px]
              body_2
              pl-[16px]
              gap-[8px]
              hover:opacity-90
            "
          >
            <Image
              src="/AdminEdit.svg"
              alt="수정 아이콘"
              width={24}
              height={24}
            />
            수정하기
          </Link>
        </div>
      </div>
    </>
  );
}