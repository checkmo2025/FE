"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LANDING_KEY = "seen_landing_v1";
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const seen = localStorage.getItem(LANDING_KEY);
    if (seen) {
      const expired = Date.now() - parseInt(seen, 10) > EXPIRY_MS;
      if (!expired) {
        router.replace("/home");
        return;
      }
    }
    router.replace("/landing");
  }, [router]);

  return null;
}
