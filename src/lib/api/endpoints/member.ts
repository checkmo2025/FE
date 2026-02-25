import { API_BASE_URL } from "./base";

export const MEMBER_ENDPOINTS = {
    RECOMMEND: `${API_BASE_URL}/members/me/recommend`,
    UPDATE_PROFILE: `${API_BASE_URL}/members/me`,
    UPDATE_PASSWORD: `${API_BASE_URL}/members/me/update-password`,
};
