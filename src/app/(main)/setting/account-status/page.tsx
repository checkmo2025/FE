import type { Metadata } from "next";
import AccountStatusPageClient from "./AccountStatusPageClient";

export const metadata: Metadata = {
  title: "계정 상태",
};

export default function AccountStatusPage() {
  return <AccountStatusPageClient />;
}
