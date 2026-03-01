import { API_BASE_URL } from "../endpoints";

export type ImageUploadType = "PROFILE" | "CLUB" | "NOTICE";

export const IMAGE = {
  uploadUrl: (type: ImageUploadType) =>
    `${API_BASE_URL}/image/${type}/upload-url`, // POST
} as const;