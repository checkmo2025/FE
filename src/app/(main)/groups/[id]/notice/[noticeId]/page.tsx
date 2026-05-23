import type { Metadata } from "next";
import NoticeDetailPageClient from "./NoticeDetailPageClient";

type Props = { params: Promise<{ id: string; noticeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${id}/home`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "공지사항" };
    const data = await res.json();
    return { title: `${data.result.name} - 공지사항` };
  } catch {
    return { title: "공지사항" };
  }
}

export default function NoticeDetailPage() {
  return <NoticeDetailPageClient />;
}
