import { API_BASE_URL } from "./base";

export const NOTIFICATION_ENDPOINTS = {
    GET_SETTINGS: `${API_BASE_URL}/notifications/settings`,
    UPDATE_SETTING: (settingType: string) => `${API_BASE_URL}/notifications/settings/${settingType}`,
    GET_NOTIFICATIONS: `${API_BASE_URL}/notifications`,
    GET_PREVIEW: (size?: number) => `${API_BASE_URL}/notifications/preview?size=${size || 5}`,
    READ_NOTIFICATION: (id: number) => `${API_BASE_URL}/notifications/${id}/read`,
};
