import { API_BASE_URL } from "./base";

export const STORY_ENDPOINTS = {
    LIST: `${API_BASE_URL}/book-stories`,
    FOLLOWING: `${API_BASE_URL}/book-stories/following`,
    ME: `${API_BASE_URL}/book-stories/me`,
    CLUB: (clubId: number) => `${API_BASE_URL}/book-stories/clubs/${clubId}`,
    OTHER_MEMBER: (nickname: string) => `${API_BASE_URL}/book-stories/members/${encodeURIComponent(nickname)}`,
    LIKE: (id: number) => `${API_BASE_URL}/book-stories/${id}/like`,
};
