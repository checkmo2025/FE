import type { Metadata } from "next";
import AccountStatusPageClient from "./AccountStatusPageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function AccountStatusPage() {
  return <AccountStatusPageClient />;
}
