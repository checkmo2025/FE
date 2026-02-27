import { API_BASE_URL } from "./base";

export const STORY_ENDPOINTS = {
    LIST: `${API_BASE_URL}/book-stories`,
    ME: `${API_BASE_URL}/book-stories/me`,
    OTHER_MEMBER: (nickname: string) => `${API_BASE_URL}/book-stories/members/${encodeURIComponent(nickname)}`,
    LIKE: (id: number) => `${API_BASE_URL}/book-stories/${id}/like`,
};
