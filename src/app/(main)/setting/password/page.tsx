import type { Metadata } from "next";
import PasswordChangePageClient from "./PasswordChangePageClient";

export const metadata: Metadata = {
  title: "비밀번호 변경",
};

export default function PasswordChangePage() {
  return <PasswordChangePageClient />;
}
