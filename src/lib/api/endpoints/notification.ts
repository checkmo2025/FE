import { API_BASE_URL } from "./base";

export const NOTIFICATION_ENDPOINTS = {
    GET_SETTINGS: `${API_BASE_URL}/notifications/settings`,
    UPDATE_SETTING: (settingType: string) => `${API_BASE_URL}/notifications/settings/${settingType}`,
};
