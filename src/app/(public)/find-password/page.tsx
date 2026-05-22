import type { Metadata } from "next";
import FindPasswordPageClient from "./FindPasswordPageClient";

export const metadata: Metadata = {
  title: "비밀번호 찾기",
};

export default function FindPasswordPage() {
  return <FindPasswordPageClient />;
}
