/**
 * URL 유효성 검사 (Swagger 기본값 "string" 또는 빈 값 처리)
 */
export const isValidUrl = (url: string | null | undefined): url is string => {
    if (!url || url === "string" || url.trim() === "") return false;

    // 허용되는 상대 경로 패턴 (예: /profile2.svg)
    if (url.startsWith("/")) return true;

    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        // 프로토콜 상대 URL 지원 (예: //example.com/image.png)
        if (url.startsWith("//")) {
            try {
                new URL(`https:${url}`);
                return true;
            } catch {
                return false;
            }
        }
        return false;
    }
};
