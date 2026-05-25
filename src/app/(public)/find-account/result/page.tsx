import type { Metadata } from "next";
import FindAccountResultPageClient from "./FindAccountResultPageClient";

export const metadata: Metadata = {
  title: "이메일 찾기 결과",
};

export default function FindAccountResultPage() {
  return <FindAccountResultPageClient />;
}
