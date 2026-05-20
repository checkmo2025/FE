import type { Metadata } from "next";
import GroupDetailClient from "./GroupDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${id}/home`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "모임" };
    const data = await res.json();
    const club = data.result;
    return {
      title: club.name,
      description: club.description?.slice(0, 100),
      openGraph: {
        title: club.name,
        description: club.description?.slice(0, 100),
        images: club.profileImageUrl ? [club.profileImageUrl] : [],
      },
    };
  } catch {
    return { title: "모임" };
  }
}

export default function GroupDetailPage() {
  return <GroupDetailClient />;
}
