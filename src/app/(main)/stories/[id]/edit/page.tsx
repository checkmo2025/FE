import type { Metadata } from "next";
import StoryEditPageClient from "./StoryEditPageClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book-stories/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "책이야기 - 수정" };
    const data = await res.json();
    return { title: `${data.result.bookStoryTitle} - 수정` };
  } catch {
    return { title: "책이야기 - 수정" };
  }
}

export default function StoryEditPage() {
  return <StoryEditPageClient />;
}
