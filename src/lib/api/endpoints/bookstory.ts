import { API_BASE_URL } from "./base";

export const STORY_ENDPOINTS = {
    LIST: `${API_BASE_URL}/book-stories`,
    ME: `${API_BASE_URL}/book-stories/me`,
    LIKE: (id: number) => `${API_BASE_URL}/book-stories/${id}/like`,
};
