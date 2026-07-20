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
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/service-introduction`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support/v1/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support/v1/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support/v1/third-party-consent`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support/v1/marketing-consent`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // 동적 사이트맵 데이터 수집 (Promise.allSettled를 이용한 병렬 처리 및 부분 성공 허용)
  const results = await Promise.allSettled([
    fetchAllSitemapItems(storyService.getStoriesSitemap),
    fetchAllSitemapItems(clubService.getClubsSitemap),
    fetchAllSitemapItems(newsService.getNewsSitemap),
  ]);

  let storyRoutes: MetadataRoute.Sitemap = [];
  let clubRoutes: MetadataRoute.Sitemap = [];
  let newsRoutes: MetadataRoute.Sitemap = [];

  if (results[0].status === "fulfilled") {
    storyRoutes = results[0].value.map((item) => ({
      url: `${baseUrl}/stories/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } else {
    console.error("Failed to fetch stories sitemap:", results[0].reason);
  }

  if (results[1].status === "fulfilled") {
    clubRoutes = results[1].value.map((item) => ({
      url: `${baseUrl}/groups/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } else {
    console.error("Failed to fetch clubs sitemap:", results[1].reason);
  }

  if (results[2].status === "fulfilled") {
    newsRoutes = results[2].value.map((item) => ({
      url: `${baseUrl}/news/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "daily",
      priority: 0.7,
    }));
  } else {
    console.error("Failed to fetch news sitemap:", results[2].reason);
  }

  return [...staticRoutes, ...storyRoutes, ...clubRoutes, ...newsRoutes];
}
