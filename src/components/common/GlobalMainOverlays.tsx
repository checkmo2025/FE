"use client";

import { useState } from "react";

import ChatbotWidget from "@/components/common/Chatbot/ChatbotWidget";
import GlobalAppOpenCta from "@/components/common/GlobalAppOpenCta";

export default function GlobalMainOverlays() {
  const [isAppOpenCtaVisible, setIsAppOpenCtaVisible] = useState(false);

  return (
    <>
      <GlobalAppOpenCta onVisibilityChange={setIsAppOpenCtaVisible} />
      <ChatbotWidget isAppOpenCtaVisible={isAppOpenCtaVisible} />
    </>
  );
}
