import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
  title: {
    absolute: "독서 모임 플랫폼 CheckMo",
  },
  description: "함께 읽고, 나누고, 성장하는 독서 모임 플랫폼",
  openGraph: {
    title: "독서 모임 플랫폼 CheckMo",
    description: "함께 읽고, 나누고, 성장하는 독서 모임 플랫폼",
  },
};

export default function LandingPage() {
  return <LandingPageClient />;
}
