import type { Metadata } from "next";
import PasswordChangePageClient from "./PasswordChangePageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function PasswordChangePage() {
  return <PasswordChangePageClient />;
}
