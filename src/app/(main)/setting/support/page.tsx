import type { Metadata } from "next";
import SupportPageClient from "./SupportPageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function SupportPage() {
  return <SupportPageClient />;
}
