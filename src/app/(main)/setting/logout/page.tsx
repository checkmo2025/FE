import type { Metadata } from "next";
import LogoutPageClient from "./LogoutPageClient";

export const metadata: Metadata = {
  title: "로그아웃",
};

export default function LogoutPage() {
  return <LogoutPageClient />;
}
