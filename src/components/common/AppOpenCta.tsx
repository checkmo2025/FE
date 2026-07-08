"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import appIcon from "@/app/apple-icon.png";
import { buildCheckmoAppUrl, CHECKMO_APP_LINKS } from "@/constants/links";

const APP_OPEN_CTA_SESSION_DISMISSED_KEY = "checkmo.appOpenCta.sessionDismissed";
const DISMISS_ANIMATION_MS = 180;

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

function shouldForceShowCta() {
  return new URLSearchParams(window.location.search).get("showCta") === "1";
}

function isAppOpenCtaDismissedInSession() {
  return window.sessionStorage.getItem(APP_OPEN_CTA_SESSION_DISMISSED_KEY) === "true";
}

export default function AppOpenCta({ appPath, className = "" }: AppOpenCtaProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const openAttemptCleanupRef = useRef<(() => void) | null>(null);
  const dismissTimeoutRef = useRef<number | null>(null);
  const appUrl = useMemo(() => buildCheckmoAppUrl(appPath), [appPath]);

  const cleanupOpenAttempt = useCallback(() => {
    openAttemptCleanupRef.current?.();
    openAttemptCleanupRef.current = null;
  }, []);

  const cleanupDismissTimeout = useCallback(() => {
    if (dismissTimeoutRef.current !== null) {
      window.clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let isDismissed = false;
      let forceShow = false;

      try {
        forceShow = shouldForceShowCta();
        isDismissed = forceShow ? false : isAppOpenCtaDismissedInSession();
      } catch {
        isDismissed = false;
      }

      const shouldShow = isIOSDevice() && !isDismissed;
      setIsVisible(shouldShow);
      setIsClosing(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => cleanupOpenAttempt, [cleanupOpenAttempt]);
  useEffect(() => cleanupDismissTimeout, [cleanupDismissTimeout]);

  const handleOpenApp = useCallback(() => {
    cleanupOpenAttempt();

    let didLeavePage = false;
    let timeoutId: number | null = null;

    const markPageLeave = () => {
      didLeavePage = true;
    };

    const cleanup = () => {
      document.removeEventListener("visibilitychange", markPageLeave);
      window.removeEventListener("pagehide", markPageLeave);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      openAttemptCleanupRef.current = null;
    };

    openAttemptCleanupRef.current = cleanup;

    document.addEventListener("visibilitychange", markPageLeave, { once: true });
    window.addEventListener("pagehide", markPageLeave, { once: true });
    window.location.href = appUrl;

    timeoutId = window.setTimeout(() => {
      cleanup();

      if (!didLeavePage && document.visibilityState === "visible") {
        window.location.href = CHECKMO_APP_LINKS.IOS_APP_STORE_URL;
      }
    }, 1600);
  }, [appUrl, cleanupOpenAttempt]);

  const handleDismiss = useCallback(() => {
    cleanupOpenAttempt();
    cleanupDismissTimeout();

    try {
      window.sessionStorage.setItem(APP_OPEN_CTA_SESSION_DISMISSED_KEY, "true");
    } catch {
      // sessionStorage 접근이 막혀도 현재 화면에서는 즉시 숨긴다.
    }

    setIsClosing(true);
    dismissTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      dismissTimeoutRef.current = null;
    }, DISMISS_ANIMATION_MS);
  }, [cleanupDismissTimeout, cleanupOpenAttempt]);

  if (!isVisible) return null;

  return (
    <section
      className={`fixed z-40 t:hidden ${className}`}
      style={{
        left: 16,
        width: "calc(100vw - 32px)",
        bottom: "calc(env(safe-area-inset-bottom) + 82px)",
      }}
      aria-label="책모 앱에서 보기"
    >
      <div
        className={`group grid h-16 w-full items-center gap-2 overflow-hidden rounded-[8px] border border-Subbrown-4 bg-White px-3 shadow-sm transition-[border-color,box-shadow,opacity,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-Subbrown-3 hover:shadow-md ${
          isClosing ? "pointer-events-none translate-y-2 scale-[0.98] opacity-0" : "opacity-100"
        }`}
        style={{ gridTemplateColumns: "36px minmax(0, 1fr) 72px 28px" }}
      >
        <Image
          src={appIcon}
          alt="책모"
          width={36}
          height={36}
          className="rounded-[8px]"
          priority={false}
        />
        <p className="body_1_1 min-w-0 truncate text-Gray-7">앱에서 바로 보기</p>
        <button
          type="button"
          onClick={handleOpenApp}
          className="inline-flex h-10 w-full items-center justify-center rounded-[8px] bg-primary-1 text-White body_1_1 transition-colors duration-200 hover:bg-primary-3 active:scale-[0.98]"
          aria-label="책모 앱 열기"
        >
          앱 열기
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-Gray-4 transition-colors duration-200 hover:bg-Subbrown-4 hover:text-Gray-7 active:scale-[0.96]"
          aria-label="책모 앱 열기 안내 닫기"
        >
          <span aria-hidden="true" className="text-[20px] leading-none">
            ×
          </span>
        </button>
      </div>
    </section>
  );
}
