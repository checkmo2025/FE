export interface SitemapItem {
    id: number;
    updatedAt: string;
}

export interface SitemapListResponse {
    items: SitemapItem[];
    hasNext: boolean;
    nextCursor: number | null;
    pageSize: number;
}
