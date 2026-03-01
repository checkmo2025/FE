// src/services/imageService.ts
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import { IMAGE, type ImageUploadType } from "@/lib/api/endpoints/Image";

type PresignedRequest = {
  originalFileName: string;
  contentType: string;
};

type PresignedResult = {
  presignedUrl: string;
  imageUrl: string;
};

async function putToPresignedUrl(presignedUrl: string, file: File, contentType: string) {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`S3 업로드 실패 (HTTP ${res.status}) ${text}`);
  }
}

export const imageService = {
  // POST /api/image/{type}/upload-url
  getUploadUrl: (type: ImageUploadType, body: PresignedRequest) =>
    apiClient.post<ApiResponse<PresignedResult>>(IMAGE.uploadUrl(type), body),

  // ✅ create 페이지에서 쓰는 "CLUB 업로드 한방"
  uploadClubImage: async (file: File) => {
    const contentType = file.type || "application/octet-stream";

    const presigned = await imageService.getUploadUrl("CLUB", {
      originalFileName: file.name,
      contentType,
    });

    const { presignedUrl, imageUrl } = presigned.result;

    await putToPresignedUrl(presignedUrl, file, contentType);
    return imageUrl;
  },
};