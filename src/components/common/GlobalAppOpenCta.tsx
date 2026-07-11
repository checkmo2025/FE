"use client";

import { usePathname } from "next/navigation";
import AppOpenCta from "@/components/common/AppOpenCta";
import { useAuthStore } from "@/store/useAuthStore";

const CTA_EXCLUDED_PATHS = new Set([
  "/groups/create",
  "/stories/new",
  "/ui-test",
]);

function isCtaExcludedPath(pathname: string) {
  if (CTA_EXCLUDED_PATHS.has(pathname)) return true;

  return (
    pathname.startsWith("/setting") ||
    /^\/groups\/[^/]+\/admin(?:\/|$)/.test(pathname) ||
    /^\/stories\/[^/]+\/edit(?:\/|$)/.test(pathname)
  );
}

function getAppPath(pathname: string) {
  if (/^\/stories(?:\/\d+)?$/.test(pathname)) return pathname;
  if (/^\/groups(?:\/\d+)?$/.test(pathname)) return pathname;
  if (/^\/news(?:\/\d+)?$/.test(pathname)) return pathname;
  if (/^\/profile\/[^/]+(?:\/follows)?$/.test(pathname)) return pathname;

  const groupMeetingPath = pathname.match(
    /^\/groups\/(\d+)\/bookcase\/(\d+)(?:\/meeting)?$/,
  );
  if (groupMeetingPath) {
    const [, groupId, meetingId] = groupMeetingPath;
    return `/groups/${groupId}/meetings/${meetingId}`;
  }

  const groupNoticePath = pathname.match(
    /^\/groups\/(\d+)\/notice(?:\/(\d+))?$/,
  );
  if (groupNoticePath) {
    const [, groupId, noticeId] = groupNoticePath;
    return noticeId
      ? `/groups/${groupId}/notice/${noticeId}`
      : `/groups/${groupId}`;
  }

  const groupPath = pathname.match(/^\/groups\/(\d+)(?:\/|$)/);
  if (groupPath) return `/groups/${groupPath[1]}`;

  return "/";
}

export default function GlobalAppOpenCta() {
  const pathname = usePathname();
  const isLoginModalOpen = useAuthStore((state) => state.isLoginModalOpen);

  if (isLoginModalOpen || isCtaExcludedPath(pathname)) return null;

  return <AppOpenCta appPath={getAppPath(pathname)} />;
}
