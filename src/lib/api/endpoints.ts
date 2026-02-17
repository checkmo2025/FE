export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.checkmo.co.kr/api";

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  EMAIL_VERIFICATION: `${API_BASE_URL}/auth/email-verification`,
  EMAIL_CONFIRM: `${API_BASE_URL}/auth/email-verification/confirm`,
  ADDITIONAL_INFO: `${API_BASE_URL}/members/additional-info`,
  CHECK_NICKNAME: `${API_BASE_URL}/members/check-nickname`,
  PROFILE: `${API_BASE_URL}/members/me`,
};
