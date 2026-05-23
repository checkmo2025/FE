import type { Metadata } from "next";
import StoriesPageClient from "./StoriesPageClient";

export const metadata: Metadata = {
  title: "책이야기",
  description: "독서 모임원들의 독후감과 이야기를 나눠보세요",
};

export default function StoriesPage() {
  return <StoriesPageClient />;
}
