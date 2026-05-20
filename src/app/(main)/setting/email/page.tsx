import type { Metadata } from "next";
import EmailChangePageClient from "./EmailChangePageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function EmailChangePage() {
  return <EmailChangePageClient />;
}
