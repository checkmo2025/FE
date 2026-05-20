import type { Metadata } from "next";
import StoryDetailClient from "./StoryDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book-stories/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "책이야기" };
    const data = await res.json();
    const story = data.result;
    return {
      title: story.bookStoryTitle,
      description: story.description?.slice(0, 100),
      openGraph: {
        title: story.bookStoryTitle,
        description: story.description?.slice(0, 100),
        images: story.bookInfo?.imgUrl ? [story.bookInfo.imgUrl] : [],
      },
    };
  } catch {
    return { title: "책이야기" };
  }
}

export default function StoryDetailPage() {
  return <StoryDetailClient />;
}
