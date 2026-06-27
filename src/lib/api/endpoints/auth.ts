import { API_BASE_URL } from "./base";

export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    EMAIL_VERIFICATION: `${API_BASE_URL}/auth/email-verification`,
    EMAIL_CONFIRM: `${API_BASE_URL}/auth/email-verification/confirm`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    TEMP_PASSWORD: `${API_BASE_URL}/auth/temp-password`,
};
