import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { isValidUrl } from "@/utils/url";

const LOCAL_IMAGE_FILE_PATTERN =
  /^[A-Za-z0-9._/-]+\.(?:svg|png|jpe?g|webp|gif|avif)$/;

export function getProfileImageSrc(src?: string | null): string {
  const trimmed = typeof src === "string" ? src.trim() : "";

  if (!trimmed || trimmed === "string") {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (isValidUrl(trimmed)) {
    return trimmed;
  }

  if (LOCAL_IMAGE_FILE_PATTERN.test(trimmed)) {
    return `/${trimmed.replace(/^\.?\//, "")}`;
  }

  return DEFAULT_PROFILE_IMAGE;
}
