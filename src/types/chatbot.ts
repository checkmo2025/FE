export interface ChatbotMessageRequest {
  sessionToken?: string | null;
  message: string;
}

export interface ChatbotReply {
  sessionToken: string;
  replyText: string;
  escalated: boolean;
  modelUsed: string;
  handoffSuggested: boolean;
  supportUrl: string;
  inquiryFormUrl: string;
}
