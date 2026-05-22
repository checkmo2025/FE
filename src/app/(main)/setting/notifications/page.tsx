import type { Metadata } from "next";
import NotificationPageClient from "./NotificationPageClient";

export const metadata: Metadata = {
  title: "알림 설정",
};

export default function NotificationPage() {
  return <NotificationPageClient />;
}
