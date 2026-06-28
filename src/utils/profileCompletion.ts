import { User } from "@/types/auth";

export const PROFILE_COMPLETION_BASE_ROUTE = "/signup/terms?isSocial=true";
export const PROFILE_COMPLETION_ROUTE = `${PROFILE_COMPLETION_BASE_ROUTE}&profileRequired=true`;

const PROFILE_COMPLETION_PATHS = new Set([
  "/signup/terms",
  "/signup/profile",
  "/signup/profile-image",
]);

export const isProfileCompletionPath = (pathname: string | null) => {
  if (!pathname) return false;
  return PROFILE_COMPLETION_PATHS.has(pathname);
};

export const isProfileIncomplete = (user: User | null | undefined) => {
  if (!user) return false;

  if (typeof user.profileCompleted === "boolean") {
    return !user.profileCompleted;
  }

  return !user.nickname;
};

export const isProfileIncompleteError = (error: unknown) => {
  if (!(error instanceof Error)) return false;

  const errorWithMeta = error as Error & {
    code?: string;
    response?: {
      code?: string;
      message?: string;
    };
  };

  const code = errorWithMeta.code || errorWithMeta.response?.code || "";
  const message = error.message || errorWithMeta.response?.message || "";

  return (
    code === "HTTP403" ||
    message.includes("프로필이 완성되지 않은 회원") ||
    message.includes("프로필을 완성")
  );
};
