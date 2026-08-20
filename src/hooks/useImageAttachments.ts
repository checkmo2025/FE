"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { imageService } from "@/services/imageService";
import type { ImageUploadType } from "@/lib/api/endpoints/Image";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const IMAGE_FILE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export type ImageAttachment = {
  id: string;
  previewUrl: string;
  imageUrl?: string;
  file?: File;
};

type AddFilesResult = {
  addedCount: number;
  rejectedCount: number;
  overflowCount: number;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

function remoteAttachment(imageUrl: string): ImageAttachment {
  return {
    id: `remote-${imageUrl}`,
    previewUrl: imageUrl,
    imageUrl,
  };
}

export function useImageAttachments(initialImageUrls: string[] = [], maxCount = 5) {
  const objectUrlsRef = useRef(new Set<string>());
  const [baselineUrls, setBaselineUrls] = useState([...initialImageUrls]);
  const [items, setItems] = useState<ImageAttachment[]>(() =>
    initialImageUrls.map(remoteAttachment)
  );

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  const revokeLocalPreviews = useCallback(() => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  const reset = useCallback(
    (imageUrls: string[] = []) => {
      revokeLocalPreviews();
      setBaselineUrls([...imageUrls]);
      setItems(imageUrls.map(remoteAttachment));
    },
    [revokeLocalPreviews]
  );

  const addFiles = useCallback(
    (files: File[]): AddFilesResult => {
      const validFiles = files.filter((file) => ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase()));
      const rejectedCount = files.length - validFiles.length;
      const remaining = Math.max(0, maxCount - items.length);
      const selectedFiles = validFiles.slice(0, remaining);

      const newItems = selectedFiles.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        objectUrlsRef.current.add(previewUrl);
        return {
          id: createId(),
          previewUrl,
          file,
        };
      });

      if (newItems.length > 0) {
        setItems((current) => [...current, ...newItems]);
      }

      return {
        addedCount: newItems.length,
        rejectedCount,
        overflowCount: Math.max(0, validFiles.length - remaining),
      };
    },
    [items.length, maxCount]
  );

  const remove = useCallback((id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.file) {
        URL.revokeObjectURL(target.previewUrl);
        objectUrlsRef.current.delete(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }, []);

  const move = useCallback((id: string, direction: -1 | 1) => {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }, []);

  const resolveUrls = useCallback(
    async (uploadType: ImageUploadType) => {
      const resolvedUrls: string[] = [];
      for (const item of items) {
        if (item.imageUrl) {
          resolvedUrls.push(item.imageUrl);
          continue;
        }
        if (!item.file) throw new Error("업로드할 이미지 파일을 찾을 수 없습니다.");
        const imageUrl = await imageService.uploadImage(uploadType, item.file);
        resolvedUrls.push(imageUrl);
        setItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id ? { ...currentItem, imageUrl } : currentItem
          )
        );
      }
      return resolvedUrls;
    },
    [items]
  );

  const isDirty = useMemo(() => {
    if (items.some((item) => item.file && !item.imageUrl)) return true;
    const currentUrls = items.map((item) => item.imageUrl ?? "");
    return currentUrls.join("\n") !== baselineUrls.join("\n");
  }, [baselineUrls, items]);

  return {
    items,
    maxCount,
    isDirty,
    addFiles,
    remove,
    move,
    reset,
    resolveUrls,
  };
}

export type ImageAttachmentsController = ReturnType<typeof useImageAttachments>;
