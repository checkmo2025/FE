export interface NewsBasicInfo {
    newsId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishStartAt: string;
}

export interface NewsListResponse {
    basicInfoList: NewsBasicInfo[];
    hasNext: boolean;
    nextCursor: number | null;
    pageSize: number;
}
