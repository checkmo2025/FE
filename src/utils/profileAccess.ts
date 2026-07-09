import { getErrorMessage, hasErrorCode } from "@/lib/api/errors";

const PROFILE_ACCESS_ERROR_CODES = new Set(["MEMBER_400", "BLOCK_404", "BLOCK_405"]);

export function getProfileAccessErrorMessage(error: unknown): string | null {
  if (!hasErrorCode(error) || !PROFILE_ACCESS_ERROR_CODES.has(error.code)) {
    return null;
  }

  if (error.code === "MEMBER_400") {
    return "탈퇴했거나 존재하지 않는 회원입니다.";
  }

  return error.message || getErrorMessage(error.code);
}
