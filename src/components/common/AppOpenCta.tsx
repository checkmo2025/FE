"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildCheckmoAppUrl, CHECKMO_APP_LINKS } from "@/constants/links";

type AppOpenCtaProps = {
  appPath: string;
  className?: string;
};

function isIOSDevice() {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const isIPadOS = platform === "MacIntel" && window.navigator.maxTouchPoints > 1;

  return (/iPad|iPhone|iPod/.test(userAgent) || isIPadOS) && !/Android/i.test(userAgent);
}

export default function AppOpenCta({ appPath, className = "" }: AppOpenCtaProps) {
  const [isVisible, setIsVisible] = useState(false);
  const appUrl = useMemo(() => buildCheckmoAppUrl(appPath), [appPath]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(isIOSDevice());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleOpenApp = useCallback(() => {
    let didLeavePage = false;

    const markPageLeave = () => {
      didLeavePage = true;
    };

    document.addEventListener("visibilitychange", markPageLeave, { once: true });
    window.addEventListener("pagehide", markPageLeave, { once: true });
    window.location.href = appUrl;

    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", markPageLeave);
      window.removeEventListener("pagehide", markPageLeave);

      if (!didLeavePage && document.visibilityState === "visible") {
        window.location.href = CHECKMO_APP_LINKS.IOS_APP_STORE_URL;
      }
    }, 1600);
  }, [appUrl]);

  if (!isVisible) return null;

  return (
    <section className={`t:hidden ${className}`} aria-label="책모 앱에서 보기">
      <div className="flex items-center justify-between gap-3 rounded-[8px] border border-Subbrown-4 bg-White px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <p className="body_2_1 text-primary-2">책모 앱</p>
          <p className="body_1_1 text-Gray-7">앱에서 바로 보기</p>
        </div>
        <button
          type="button"
          onClick={handleOpenApp}
          className="shrink-0 inline-flex h-10 items-center gap-1.5 rounded-[8px] bg-primary-1 px-4 text-White body_1_1 active:scale-[0.98]"
          aria-label="책모 앱 열기"
        >
          앱 열기
          <Image src="/ArrowRight.svg" alt="" width={14} height={14} className="brightness-0 invert" />
        </button>
      </div>
    </section>
  );
}
