export interface NewsBasicInfo {
    newsId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    carousel: "PROMOTION" | "GENERAL";
    publishStartAt: string;
}

export interface NewsListResponse {
    basicInfoList: NewsBasicInfo[];
    hasNext: boolean;
    nextCursor: number | null;
    pageSize: number;
}

export interface NewsDetail {
    newsId: number;
    title: string;
    content: string;
    thumbnailUrl: string;
    originalLink: string;
    carousel: "PROMOTION" | "GENERAL";
    imageUrls: string[];
    publishStartAt: string;
}
