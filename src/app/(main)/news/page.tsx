import type { Metadata } from "next";
import NewsPageClient from "./NewsPageClient";

export const metadata: Metadata = {
  title: "소식",
  description: "CheckMo의 최신 소식을 확인하세요",
};

export default function NewsPage() {
  return <NewsPageClient />;
}
