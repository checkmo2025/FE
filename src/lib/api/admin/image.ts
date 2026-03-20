import { IMAGE, type ImageUploadType } from "./endpoints/image";

export async function getPresignedUrl(type: ImageUploadType, file: File) {
  const res = await fetch(IMAGE.uploadUrl(type), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      originalFileName: file.name,
      contentType: file.type,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`presigned url 요청 실패: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.result as { presignedUrl: string; imageUrl: string };
}

export async function uploadToS3(presignedUrl: string, file: File) {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`S3 업로드 실패: ${res.status} ${text}`);
  }
}

export async function uploadImage(type: ImageUploadType, file: File) {
  const { presignedUrl, imageUrl } = await getPresignedUrl(type, file);
  await uploadToS3(presignedUrl, file);
  return imageUrl;
}