import { API_BASE_URL } from "./base";

export const REPORT_ENDPOINTS = {
    CREATE: `${API_BASE_URL}/reports`,
    GET_MY_REPORTS: `${API_BASE_URL}/reports/me`,
} as const;
