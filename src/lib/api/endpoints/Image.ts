import { API_BASE_URL } from "./base";

export type ImageUploadType =
  | "PROFILE"
  | "CLUB"
  | "NOTICE"
  | "BOOK_STORY"
  | "BOOK_STORY_COMMENT"
  | "NOTICE_COMMENT";

export const IMAGE = {
  uploadUrl: (type: ImageUploadType) =>
    `${API_BASE_URL}/image/${type}/upload-url`, // POST
} as const;
