import { ADMIN_NEWS_ENDPOINTS } from "./endpoints/news";
import { uploadImage } from "./image";
import type { ImageUploadType } from "./endpoints/image";

/** 공통 응답 래퍼 */
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

/** GET /api/admin/news 응답 아이템 */
export type AdminNewsBasicInfo = {
  newsId: number;
  title: string;
  requesterEmail: string;
  createdAt: string; // "2026-01-22"
  publishStartAt: string; // "2026-01-22"
  publishEndAt: string; // "2026-02-10"
};

/** GET /api/admin/news 응답 result */
export type AdminNewsListResult = {
  basicInfoList: AdminNewsBasicInfo[];
  page: number; // 0-based
  totalPages: number;
  totalElements: number;
};

export type AdminNewsListResponse = ApiResponse<AdminNewsListResult>;

/** GET: 관리자 소식 목록 조회 (page는 0-based로 넣기) */
export async function fetchAdminNews(page: number): Promise<AdminNewsListResponse> {
  const res = await fetch(`${ADMIN_NEWS_ENDPOINTS.GET_ADMIN_NEWS_LIST}?page=${page}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`관리자 소식 목록 조회 실패 (${res.status})`);
  }

  return res.json();
}

/** POST 요청 바디 타입 */
export type CreateAdminNewsRequest = {
  title: string;
  requesterEmail: string;
  content: string;
  thumbnailUrl?: string;
  originalLink: string;
  publishStartAt: string; // "YYYY-MM-DD"
  publishEndAt: string; // "YYYY-MM-DD"
  imageUrls?: string[];
};

/** POST 응답 타입 (result는 생성된 newsId) */
export type CreateAdminNewsResponse = ApiResponse<number>;

/** POST: 관리자 소식 등록 (순수 POST) */
export async function createAdminNews(
  data: CreateAdminNewsRequest
): Promise<CreateAdminNewsResponse> {
  const res = await fetch(ADMIN_NEWS_ENDPOINTS.GET_ADMIN_NEWS_LIST, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`관리자 소식 등록 실패 (${res.status})`);
  }

  return res.json();
}

export type CreateAdminNewsWithImagesInput = Omit<
  CreateAdminNewsRequest,
  "thumbnailUrl" | "imageUrls"
> & {
  /** 대표 이미지 파일 (없으면 업로드/전송 안 함) */
  thumbnailFile?: File | null;
  /** 기타 이미지 파일들 */
  imageFiles?: File[];
  /** S3 업로드 타입 (보통 NOTICE) */
  uploadType?: ImageUploadType; // default: "NOTICE"
};

/**
 * S3 업로드 → URL 생성 → POST까지 한 번에 처리
 */
export async function createAdminNewsWithImages(
  input: CreateAdminNewsWithImagesInput
): Promise<CreateAdminNewsResponse> {
  const { thumbnailFile, imageFiles = [], uploadType = "NOTICE", ...rest } = input;

  const thumbnailUrl = thumbnailFile
    ? await uploadImage(uploadType, thumbnailFile)
    : undefined;

  const imageUrls =
    imageFiles.length > 0
      ? await Promise.all(imageFiles.map((f) => uploadImage(uploadType, f)))
      : undefined;

  return createAdminNews({
    ...rest,
    thumbnailUrl,
    imageUrls,
  });
}

/** GET /api/admin/news/{newsId} 응답 result */
export type AdminNewsDetailResult = {
  newsId: number;
  title: string;
  requesterEmail: string;
  content: string;
  thumbnailUrl: string;
  originalLink: string;
  carousel: string;
  imageUrls: string[];
  createdAt: string;
  publishStartAt: string;
  publishEndAt: string;
};

export type AdminNewsDetailResponse = ApiResponse<AdminNewsDetailResult>;

/** GET: 관리자 소식 상세 조회 */
export async function fetchAdminNewsDetail(
  newsId: number
): Promise<AdminNewsDetailResponse> {
  const res = await fetch(ADMIN_NEWS_ENDPOINTS.GET_ADMIN_NEWS_DETAIL(newsId), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`관리자 소식 상세 조회 실패 (${res.status})`);
  }

  return res.json();
}