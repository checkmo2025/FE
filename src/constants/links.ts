export const EXTERNAL_LINKS = {
    INQUIRY_FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfcY9nWElffO0gbjRlxFzEV4YKCOznMsv4PqfFO8MjgR1xaBg/viewform",
    ALADIN_BESTSELLER_URL: "https://www.aladin.co.kr/shop/common/wbest.aspx?BranchType=1&srsltid=AfmBOoormYbm3TGHXQJYOcGgci2IQp6ytpjw-CJgV2wQALS9lsE5-pTo",
    NEWS_FROM_URL: "https://forms.gle/7ZBdXSn9BnR7MC6N6",
} as const;

export const CHECKMO_APP_LINKS = {
    IOS_APP_STORE_ID: process.env.NEXT_PUBLIC_CHECKMO_IOS_APP_STORE_ID ?? "6777671102",
    IOS_APP_STORE_URL:
        process.env.NEXT_PUBLIC_CHECKMO_IOS_APP_STORE_URL ?? "https://apps.apple.com/app/id6777671102",
    FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://www.checkmo.co.kr",
    APP_SCHEME: "checkmo",
} as const;

export function buildCheckmoWebUrl(path: string) {
    const baseUrl = CHECKMO_APP_LINKS.FRONTEND_URL.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}

export function buildCheckmoAppUrl(path: string) {
    const normalizedPath = path.replace(/^\/+/, "");
    return `${CHECKMO_APP_LINKS.APP_SCHEME}://${normalizedPath}`;
}
