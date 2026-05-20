import type { Metadata } from "next";
import LogoutPageClient from "./LogoutPageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function LogoutPage() {
  return <LogoutPageClient />;
}
