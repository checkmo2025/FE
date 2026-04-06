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

  if (
    trimmed === "string" ||
    trimmed === "null" ||
    trimmed === "undefined"
  ) {
    return fallback;
  }

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
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (Number.isNaN(newsId)) {
      setIsInvalid(true);
      setLoading(false);
      return;
    }

    let alive = true;

    const run = async () => {
      try {
        setIsError(false);

        const response = await fetchAdminNewsDetail(newsId);

        if (!alive) return;

        if (!response.isSuccess) {
          setIsError(true);
          return;
        }

        setNews(response.result);
      } catch (error) {
        if (!alive) return;
        setIsError(true);
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full text-red-500 text-sm font-medium">
        소식 상세정보 불러오기 실패
      </div>
    );
  }

  if (isInvalid || !news) {
    notFound();
  }

  return (
    <>
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

      <div className="mx-auto w-full max-w-[1400px] px-9 t:px-[200px] mt-6 t:mt-10">
        <p className="body_2_2 text-Gray-4 mb-2">
          게시기간 {news.publishStartAt} - {news.publishEndAt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="subhead_1 t:headline_3 text-Gray-7">{news.title}</h1>
          <p className="body_1_2 text-Gray-3">{news.createdAt}</p>
        </div>

        <div className="w-full max-w-[1040px] mt-22">
          <p className="body_1_3 t:subhead_3 text-Gray-6 whitespace-pre-wrap">
            {news.content}
          </p>
        </div>

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