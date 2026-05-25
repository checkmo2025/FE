import type { Metadata } from "next";
import BookcasePageClient from "./BookcasePageClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${id}/home`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "책장" };
    const data = await res.json();
    const club = data.result;
    return {
      title: `${club.name} - 책장`,
    };
  } catch {
    return { title: "책장" };
  }
}

export default function BookcasePage() {
  return <BookcasePageClient />;
}
