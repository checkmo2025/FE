import type { Metadata } from "next";
import BlockPageClient from "./BlockPageClient";

export const metadata: Metadata = {
  title: "차단 관리",
};

export default function BlockPage() {
  return <BlockPageClient />;
}
