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

  // 이미지 업로드 공통 헬퍼: presigned URL 발급 → S3 PUT → imageUrl 반환
  uploadImage: async (type: ImageUploadType, file: File): Promise<string> => {
    const contentType = file.type || "application/octet-stream";

    const presigned = await imageService.getUploadUrl(type, {
      originalFileName: file.name,
      contentType,
    });

    const { presignedUrl, imageUrl } = presigned.result;

    await putToPresignedUrl(presignedUrl, file, contentType);
    return imageUrl;
  },

  // PROFILE 이미지 업로드
  uploadProfileImage: (file: File) => imageService.uploadImage("PROFILE", file),

  // CLUB 이미지 업로드
  uploadClubImage: (file: File) => imageService.uploadImage("CLUB", file),
};