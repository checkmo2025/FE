import { API_BASE_URL } from "./base";

export const MEMBER_ENDPOINTS = {
    GET_PROFILE: `${API_BASE_URL}/members/me`,
    RECOMMEND: `${API_BASE_URL}/members/me/recommend`,
    UPDATE_PROFILE: `${API_BASE_URL}/members/me`,
    UPDATE_PASSWORD: `${API_BASE_URL}/members/me/update-password`,
    GET_OTHER_PROFILE: (nickname: string) => `${API_BASE_URL}/members/${encodeURIComponent(nickname)}`,
    FOLLOW: (nickname: string) => `${API_BASE_URL}/members/${encodeURIComponent(nickname)}/following`,
    REPORT: `${API_BASE_URL}/members/report`,
    GET_FOLLOWERS: `${API_BASE_URL}/members/me/follower`,
    GET_FOLLOWINGS: `${API_BASE_URL}/members/me/following`,
    GET_OTHER_FOLLOWERS: (nickname: string) => `${API_BASE_URL}/members/${encodeURIComponent(nickname)}/followers`,
    GET_OTHER_FOLLOWINGS: (nickname: string) => `${API_BASE_URL}/members/${encodeURIComponent(nickname)}/followings`,
    GET_FOLLOW_COUNT: `${API_BASE_URL}/members/me/follow-count`,
};
