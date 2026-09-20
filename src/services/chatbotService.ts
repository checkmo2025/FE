import { apiClient, extractResult } from "@/lib/api/client";
import { CHATBOT_ENDPOINTS } from "@/lib/api/endpoints/chatbot";
import type { ApiResponse } from "@/types/auth";
import type { ChatbotMessageRequest, ChatbotReply } from "@/types/chatbot";

const CHATBOT_TIMEOUT_MS = 30_000;

export const chatbotService = {
  sendMessage: async (request: ChatbotMessageRequest): Promise<ChatbotReply> => {
    const body: ChatbotMessageRequest = request.sessionToken
      ? request
      : { message: request.message };

    const response = await apiClient.post<ApiResponse<ChatbotReply>>(
      CHATBOT_ENDPOINTS.MESSAGES,
      body,
      { timeout: CHATBOT_TIMEOUT_MS },
    );

    return extractResult(response);
  },
};
