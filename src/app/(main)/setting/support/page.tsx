import type { Metadata } from "next";
import SupportPageClient from "./SupportPageClient";

export const metadata: Metadata = {
  title: "고객센터",
};

export default function SupportPage() {
  return <SupportPageClient />;
}
