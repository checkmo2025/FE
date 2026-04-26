"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useClubMeQuery } from "@/hooks/queries/useClubhomeQueries";
import type { MyClubStatus, MyClubStatusResponseResult } from "@/types/groups/grouphome";

const MEMBER_STATUSES = new Set<MyClubStatus>(["MEMBER", "STAFF", "OWNER"]);
const STAFF_STATUSES = new Set<MyClubStatus>(["STAFF", "OWNER"]);

type ClubAccessLevel = "member" | "staff";

type ClubAccessGuardOptions = {
  clubId: number;
  require?: ClubAccessLevel;
  fallbackPath?: string;
  toastMessage?: string;
  enabled?: boolean;
};

type ClubAccessLike = Pick<MyClubStatusResponseResult, "myStatus" | "active" | "staff">;

function getErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return "";
  return "code" in error && typeof error.code === "string" ? error.code : "";
}

export function isClubMember(access?: ClubAccessLike | null) {
  if (!access) return false;
  return access.active === true && MEMBER_STATUSES.has(access.myStatus);
}

export function isClubStaff(access?: ClubAccessLike | null) {
  if (!access) return false;
  if (access.staff === true) return true;
  return STAFF_STATUSES.has(access.myStatus);
}

export function useClubAccessGuard({
  clubId,
  require = "member",
  fallbackPath,
  toastMessage,
  enabled = true,
}: ClubAccessGuardOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const handledRef = useRef(false);

  const meQuery = useClubMeQuery(clubId);
  const meData = meQuery.data;

  const isMember = useMemo(() => isClubMember(meData), [meData]);
  const isStaff = useMemo(() => isClubStaff(meData), [meData]);
  const isAllowed = require === "staff" ? isStaff : isMember;

  const errorCode = getErrorCode(meQuery.error);
  const isPermissionError = errorCode === "COMMON401" || errorCode === "COMMON403";

  const isCheckingAccess = enabled && meQuery.isLoading;
  const isUnauthorized =
    enabled &&
    !meQuery.isLoading &&
    ((meQuery.isSuccess && !isAllowed) || (isPermissionError && !isAllowed));

  useEffect(() => {
    if (!enabled) return;
    if (!Number.isFinite(clubId) || clubId <= 0) return;
    if (!isUnauthorized || handledRef.current) return;

    handledRef.current = true;

    toast.error(
      toastMessage ??
        (require === "staff" ? "운영진만 접근이 가능합니다." : "회원만 접근이 가능합니다."),
      { id: `club-access-${require}-${clubId}-${pathname}` }
    );

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.replace(fallbackPath ?? `/groups/${clubId}`);
  }, [clubId, enabled, fallbackPath, isUnauthorized, pathname, require, router, toastMessage]);

  return {
    ...meQuery,
    meData,
    isMember,
    isStaff,
    isAllowed,
    isCheckingAccess,
    isUnauthorized,
  };
}
