import type { ChatbotType } from "@/enums/chatbot";
import type { ApiResponse, PaginatedResponse } from "./response";

export type AiConversations = {
  id: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type AiConversationsResponse = ApiResponse<AiConversations>;
export type AiConversationsListResponse = ApiResponse<
  PaginatedResponse<AiConversations>
>;

export type AiMessagesPayload = {
  conversationId: string;
  role: ChatbotType;
  content: string;
};

export type AiMessages = {
  id: string;
  conversationId: string;
  createdBy: string;
  role: ChatbotType;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type AiMessagesResponse = ApiResponse<AiMessages>;
export type AiMessagesListResponse = ApiResponse<PaginatedResponse<AiMessages>>;

export type AiMessagesSSEResponse = ApiResponse<{
  token: string;
}>;

export type ChatEvent =
  | { type: "token"; value: string } // For streaming text chunks
  | { type: "message"; value: AiMessages } // For the final saved message object
  | { type: "done"; value: string | null }; // Signal to close connection and return the messageId

export type ChatEventPayload = {
  model: string;
  options: {
    maxTokens?: number;
    temperature?: number;
  };
};
