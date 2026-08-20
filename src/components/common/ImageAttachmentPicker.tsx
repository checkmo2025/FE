"use client";

import Image from "next/image";
import { useRef } from "react";
import toast from "react-hot-toast";
import {
  IMAGE_FILE_ACCEPT,
  type ImageAttachmentsController,
} from "@/hooks/useImageAttachments";

type ImageAttachmentPickerProps = {
  controller: ImageAttachmentsController;
  disabled?: boolean;
  compact?: boolean;
  label?: string;
};

export default function ImageAttachmentPicker({
  controller,
  disabled = false,
  compact = false,
  label = "이미지 첨부",
}: ImageAttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { items, maxCount, addFiles, remove, move } = controller;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const result = addFiles(Array.from(files));
    if (result.rejectedCount > 0) {
      toast.error("JPG, PNG, WebP, GIF 이미지만 첨부할 수 있습니다.");
    }
    if (result.overflowCount > 0) {
      toast.error(`이미지는 최대 ${maxCount}개까지 첨부할 수 있습니다.`);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || items.length >= maxCount}
          className="flex items-center gap-2 rounded-lg border border-Subbrown-4 bg-White px-3 py-2 body_1_2 text-primary-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Image src="/image.svg" alt="" width={18} height={18} />
          {label}
        </button>
        <span className="body_2_2 text-Gray-3">{items.length}/{maxCount}</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_FILE_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {items.length > 0 && (
        <div className={`mt-3 flex overflow-x-auto ${compact ? "gap-2" : "gap-3"}`}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`relative shrink-0 overflow-hidden rounded-lg bg-Gray-2 ${compact ? "h-20 w-20" : "h-28 w-28 t:h-36 t:w-36"}`}
            >
              <Image
                src={item.previewUrl}
                alt={`첨부 이미지 ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => remove(item.id)}
                disabled={disabled}
                aria-label={`첨부 이미지 ${index + 1} 삭제`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm text-White"
              >
                ×
              </button>
              {items.length > 1 && (
                <div className="absolute bottom-1 left-1 right-1 flex justify-between">
                  <button
                    type="button"
                    onClick={() => move(item.id, -1)}
                    disabled={disabled || index === 0}
                    aria-label="이미지 순서를 앞으로 이동"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-White disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item.id, 1)}
                    disabled={disabled || index === items.length - 1}
                    aria-label="이미지 순서를 뒤로 이동"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-White disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
