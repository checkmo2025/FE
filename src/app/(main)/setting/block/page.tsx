import type { Metadata } from "next";
import BlockPageClient from "./BlockPageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function BlockPage() {
  return <BlockPageClient />;
}
