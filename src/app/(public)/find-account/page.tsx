import type { Metadata } from "next";
import FindAccountPageClient from "./FindAccountPageClient";

export const metadata: Metadata = {
  title: "이메일 찾기",
};

export default function FindAccountPage() {
  return <FindAccountPageClient />;
}
