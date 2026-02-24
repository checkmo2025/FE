/**
 * URL 유효성 검사 (Swagger 기본값 "string" 또는 빈 값 처리)
 */
export const isValidUrl = (url: string | null | undefined): boolean => {
    if (!url || url === "string" || url.trim() === "") return false;
    return url.startsWith("/") || url.startsWith("http");
};
