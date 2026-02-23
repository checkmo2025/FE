export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn(
    "Warning: NEXT_PUBLIC_API_URL is not defined in environment variables."
  );
}

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  EMAIL_VERIFICATION: `${API_BASE_URL}/auth/email-verification`,
  EMAIL_CONFIRM: `${API_BASE_URL}/auth/email-verification/confirm`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ADDITIONAL_INFO: `${API_BASE_URL}/members/additional-info`,
  CHECK_NICKNAME: `${API_BASE_URL}/members/check-nickname`,
  PROFILE: `${API_BASE_URL}/members/me`,
};

export const STORY_ENDPOINTS = {
  LIST: `${API_BASE_URL}/book-stories`,
};

export const MEMBER_ENDPOINTS = {
  RECOMMEND: `${API_BASE_URL}/members/me/recommend`,
};
