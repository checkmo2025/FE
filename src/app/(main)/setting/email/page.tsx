import type { Metadata } from "next";
import EmailChangePageClient from "./EmailChangePageClient";

export const metadata: Metadata = {
  title: "이메일 변경",
};

export default function EmailChangePage() {
  return <EmailChangePageClient />;
}
