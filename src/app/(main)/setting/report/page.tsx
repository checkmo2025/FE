import type { Metadata } from "next";
import ReportPageClient from "./ReportPageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function ReportPage() {
  return <ReportPageClient />;
}
