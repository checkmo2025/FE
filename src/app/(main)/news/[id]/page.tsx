import type { Metadata } from "next";
import NewsDetailClient from "./NewsDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "소식" };
    const data = await res.json();
    const news = data.result;
    return {
      title: news.title,
      description: news.content?.slice(0, 100),
      openGraph: {
        title: news.title,
        description: news.content?.slice(0, 100),
        images: news.thumbnailUrl ? [news.thumbnailUrl] : [],
      },
    };
  } catch {
    return { title: "소식" };
  }
}

export default function NewsDetailPage() {
  return <NewsDetailClient />;
}
