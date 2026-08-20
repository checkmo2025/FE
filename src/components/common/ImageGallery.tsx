"use client";

import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  imageUrls?: string[];
  compact?: boolean;
};

export default function ImageGallery({ imageUrls = [], compact = false }: ImageGalleryProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  if (imageUrls.length === 0) return null;

  return (
    <>
      <div className={`grid gap-2 ${compact ? "grid-cols-3 t:grid-cols-5" : "grid-cols-2 t:grid-cols-3"}`}>
        {imageUrls.map((imageUrl, index) => (
          <button
            key={`${imageUrl}-${index}`}
            type="button"
            onClick={() => setSelectedUrl(imageUrl)}
            className={`relative overflow-hidden rounded-lg bg-Gray-2 ${compact ? "aspect-square" : "aspect-[4/3]"}`}
          >
            <Image
              src={imageUrl}
              alt={`첨부 이미지 ${index + 1}`}
              fill
              className="object-cover"
              sizes={compact ? "160px" : "(max-width: 768px) 50vw, 340px"}
            />
          </button>
        ))}
      </div>

      {selectedUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="첨부 이미지 확대 보기"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedUrl(null)}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setSelectedUrl(null)}
            className="absolute right-5 top-5 text-3xl text-White"
          >
            ×
          </button>
          <div
            className="relative h-[85vh] w-[92vw] max-w-[1100px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image src={selectedUrl} alt="확대된 첨부 이미지" fill className="object-contain" sizes="92vw" />
          </div>
        </div>
      )}
    </>
  );
}
