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

/** carousel enum 타입 */
export type CarouselType = "PROMOTION" | "GENERAL";

/** GET /api/admin/news 응답 아이템 */
export type AdminNewsBasicInfo = {
  newsId: number;
  title: string;
  requesterEmail: string;
  carousel: CarouselType;
  createdAt: string;
  publishStartAt: string;
  publishEndAt: string;
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
export async function fetchAdminNews(
  page: number
): Promise<AdminNewsListResponse> {
  const res = await fetch(
    `${ADMIN_NEWS_ENDPOINTS.GET_ADMIN_NEWS_LIST}?page=${page}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`관리자 소식 목록 조회 실패 (${res.status})`);
  }

  return res.json();
}

/** 등록/수정 공통 요청 바디 타입 */
export type AdminNewsRequest = {
  title: string;
  requesterEmail: string;
  content: string;
  thumbnailUrl?: string;
  originalLink: string;
  publishStartAt: string; // "YYYY-MM-DD"
  publishEndAt: string; // "YYYY-MM-DD"
  carousel: CarouselType;
  imageUrls?: string[];
};

/** POST 요청 바디 타입 */
export type CreateAdminNewsRequest = AdminNewsRequest;

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
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`관리자 소식 등록 실패 (${res.status}) ${errorText}`);
  }

  return res.json();
}

export type CreateAdminNewsWithImagesInput = Omit<
  CreateAdminNewsRequest,
  "thumbnailUrl" | "imageUrls"
> & {
  thumbnailFile?: File | null;
  imageFiles?: File[];
  uploadType?: ImageUploadType;
};

/**
 * S3 업로드 → URL 생성 → POST까지 한 번에 처리
 */
export async function createAdminNewsWithImages(
  input: CreateAdminNewsWithImagesInput
): Promise<CreateAdminNewsResponse> {
  const { thumbnailFile, imageFiles = [], uploadType = "NOTICE", ...rest } =
    input;

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

/** PATCH 요청 바디 타입 */
export type UpdateAdminNewsRequest = AdminNewsRequest;

/** PATCH 응답 타입 */
export type UpdateAdminNewsResponse = ApiResponse<number>;

/** PATCH: 관리자 소식 수정 (순수 PATCH) */
export async function updateAdminNews(
  newsId: number,
  data: UpdateAdminNewsRequest
): Promise<UpdateAdminNewsResponse> {
  const res = await fetch(ADMIN_NEWS_ENDPOINTS.GET_ADMIN_NEWS_DETAIL(newsId), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`관리자 소식 수정 실패 (${res.status}) ${errorText}`);
  }

  return res.json();
}

export type UpdateAdminNewsWithImagesInput = Omit<
  UpdateAdminNewsRequest,
  "thumbnailUrl" | "imageUrls"
> & {
  thumbnailFile?: File | null;
  imageFiles?: File[];
  existingThumbnailUrl?: string;
  existingImageUrls?: string[];
  uploadType?: ImageUploadType;
};

/**
 * S3 업로드 → URL 생성 → PATCH까지 한 번에 처리
 * 새 파일이 없으면 기존 URL 유지
 */
export async function updateAdminNewsWithImages(
  newsId: number,
  input: UpdateAdminNewsWithImagesInput
): Promise<UpdateAdminNewsResponse> {
  const {
    thumbnailFile,
    imageFiles = [],
    existingThumbnailUrl,
    existingImageUrls = [],
    uploadType = "NOTICE",
    ...rest
  } = input;

  const thumbnailUrl = thumbnailFile
    ? await uploadImage(uploadType, thumbnailFile)
    : existingThumbnailUrl;

  const imageUrls =
    imageFiles.length > 0
      ? await Promise.all(imageFiles.map((f) => uploadImage(uploadType, f)))
      : existingImageUrls;

  return updateAdminNews(newsId, {
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
  carousel: CarouselType;
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
    const errorText = await res.text().catch(() => "");
    throw new Error(`관리자 소식 상세 조회 실패 (${res.status}) ${errorText}`);
  }

  return res.json();
}