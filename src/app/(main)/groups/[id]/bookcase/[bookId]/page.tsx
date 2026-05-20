import type { Metadata } from "next";
import { Suspense } from "react";
import BookDetailPageClient from "./BookDetailPageClient";

type Props = { params: Promise<{ id: string; bookId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${id}/home`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "책장" };
    const data = await res.json();
    return { title: `${data.result.name} - 책장` };
  } catch {
    return { title: "책장" };
  }
}

export default function BookDetailPage() {
  return (
    <Suspense>
      <BookDetailPageClient />
    </Suspense>
  );
}
