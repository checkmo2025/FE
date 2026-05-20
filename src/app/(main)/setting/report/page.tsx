import type { Metadata } from "next";
import ReportPageClient from "./ReportPageClient";

export const metadata: Metadata = {
  title: "신고 내역",
};

export default function ReportPage() {
  return <ReportPageClient />;
}
