import type { Metadata } from "next";
import BookDetailClient from "./BookDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "도서" };
    const data = await res.json();
    if (!data?.result) return { title: "도서" };
    const book = data.result;
    return {
      title: `${book.title} - ${book.author}`,
      description: book.description?.slice(0, 100),
      openGraph: {
        title: `${book.title} - ${book.author}`,
        description: book.description?.slice(0, 100),
        images: book.imgUrl ? [book.imgUrl] : [],
      },
    };
  } catch {
    return { title: "도서" };
  }
}

export default function BookDetailPage() {
  return <BookDetailClient />;
}
