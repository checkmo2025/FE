export const ERROR_MESSAGES: Record<string, string> = {
  // Common Errors
  COMMON400: "잘못된 요청입니다.",
  COMMON401: "인증이 필요합니다.",
  COMMON403: "접근 권한이 없습니다.",
  COMMON404: "요청한 리소스를 찾을 수 없습니다.",
  COMMON500: "서버 내부 오류가 발생했습니다.",

  // Auth Errors
  USER_NOT_FOUND: "존재하지 않는 사용자입니다.",
  WRONG_PASSWORD: "비밀번호가 일치하지 않습니다.",
  DUPLICATE_EMAIL: "이미 사용 중인 이메일입니다.",
  INVALID_TOKEN: "유효하지 않은 토큰입니다.",
  EXPIRED_TOKEN: "만료된 토큰입니다.",
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || "알 수 없는 오류가 발생했습니다.";
}
