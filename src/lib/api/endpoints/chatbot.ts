import { API_BASE_URL } from "./base";

export const CHATBOT_ENDPOINTS = {
  MESSAGES: `${API_BASE_URL}/v1/chatbot/messages`,
} as const;
