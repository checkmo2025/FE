import { useMutation } from "@tanstack/react-query";

import { chatbotService } from "@/services/chatbotService";
import type { ChatbotMessageRequest } from "@/types/chatbot";

export function useChatbotMessageMutation() {
  return useMutation({
    mutationFn: (request: ChatbotMessageRequest) =>
      chatbotService.sendMessage(request),
  });
}
