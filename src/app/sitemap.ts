import { MetadataRoute } from "next";
import { storyService } from "@/services/storyService";
import { clubService } from "@/services/clubService";
import { newsService } from "@/services/newsService";
import { SitemapItem, SitemapListResponse } from "@/types/sitemap";

export const revalidate = 43200; // 12시간마다 갱신

async function fetchAllSitemapItems(
  fetchFn: (cursorId?: number, limit?: number) => Promise<SitemapListResponse>
): Promise<SitemapItem[]> {
  let allItems: SitemapItem[] = [];
  let currentCursor: number | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchFn(currentCursor, 5000); // 백엔드 최대 허용 limit
    if (response.items) {
      allItems = allItems.concat(response.items);
    }
    hasMore = response.hasNext;
    if (hasMore && response.nextCursor) {
      currentCursor = response.nextCursor;
    } else {
        hasMore = false;
    }
  }

  return allItems;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.checkmo.co.kr";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/groups`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  try {
    // 1. 책 이야기 (Stories)
    const stories = await fetchAllSitemapItems(storyService.getStoriesSitemap);
    const storyRoutes: MetadataRoute.Sitemap = stories.map((item) => ({
      url: `${baseUrl}/stories/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    // 2. 독서 모임 (Groups - 프론트 경로는 /groups)
    const clubs = await fetchAllSitemapItems(clubService.getClubsSitemap);
    const clubRoutes: MetadataRoute.Sitemap = clubs.map((item) => ({
      url: `${baseUrl}/groups/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    // 3. 소식 (News)
    const newsList = await fetchAllSitemapItems(newsService.getNewsSitemap);
    const newsRoutes: MetadataRoute.Sitemap = newsList.map((item) => ({
      url: `${baseUrl}/news/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [...staticRoutes, ...storyRoutes, ...clubRoutes, ...newsRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap", error);
    // 에러 발생 시 최소한 정적 사이트맵을 반환하여 사이트맵 구조를 유지
    return staticRoutes;
  }
}
