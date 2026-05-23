"use client";

import { useEffect } from "react";
import LandingNav from "@/components/base-ui/Landing/LandingNav";
import LandingHero from "@/components/base-ui/Landing/LandingHero";
import LandingHomeSection from "@/components/base-ui/Landing/LandingHomeSection";
import LandingClubSection from "@/components/base-ui/Landing/LandingClubSection";
import LandingStorySection from "@/components/base-ui/Landing/LandingStorySection";
import LandingNewsSection from "@/components/base-ui/Landing/LandingNewsSection";
import LandingManageSection from "@/components/base-ui/Landing/LandingManageSection";
import LandingChatSection from "@/components/base-ui/Landing/LandingChatSection";

const LANDING_KEY = "seen_landing_v1";

export default function LandingPageClient() {
  useEffect(() => {
    localStorage.setItem(LANDING_KEY, String(Date.now()));
  }, []);

  return (
    <main className="overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LandingHomeSection />
      <LandingClubSection />
      <LandingStorySection />
      <LandingNewsSection />
      <LandingManageSection />
      <LandingChatSection />
    </main>
  );
}
