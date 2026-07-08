import type { Metadata } from "next";
import { buildCheckmoWebUrl, CHECKMO_APP_LINKS } from "@/constants/links";
import StoryDetailClient from "./StoryDetailClient";

type Props = { params: Promise<{ id: string }> };

function getAppleSmartAppBannerMetadata(id: string): Metadata {
  const appArgument = buildCheckmoWebUrl(`/stories/${id}`);

  return {
    other: {
      "apple-itunes-app": `app-id=${CHECKMO_APP_LINKS.IOS_APP_STORE_ID}, app-argument=${appArgument}`,
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const appBannerMetadata = getAppleSmartAppBannerMetadata(id);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book-stories/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "책이야기", ...appBannerMetadata };
    const data = await res.json();
    if (!data?.result) return { title: "책이야기", ...appBannerMetadata };
    const story = data.result;
    return {
      ...appBannerMetadata,
      title: story.bookStoryTitle,
      description: story.description?.slice(0, 100),
      openGraph: {
        title: story.bookStoryTitle,
        description: story.description?.slice(0, 100),
        images: story.bookInfo?.imgUrl ? [story.bookInfo.imgUrl] : [],
      },
    };
  } catch {
    return { title: "책이야기", ...appBannerMetadata };
  }
}

export default function StoryDetailPage() {
  return <StoryDetailClient />;
}
