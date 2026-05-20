import type { Metadata } from "next";
import MyNewsPageClient from "./MyNewsPageClient";

export const metadata: Metadata = {
  title: "새소식",
};

export default function MyNewsPage() {
  return <MyNewsPageClient />;
}
