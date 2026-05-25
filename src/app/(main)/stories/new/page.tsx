import type { Metadata } from "next";
import StoryNewPageClient from "./StoryNewPageClient";

export const metadata: Metadata = {
  title: "책이야기 - 작성",
};

export default function NewStoryPage() {
  return <StoryNewPageClient />;
}
