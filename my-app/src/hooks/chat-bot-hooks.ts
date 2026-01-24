import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type {
  AiMessagesPayload,
  AiMessagesResponse,
  AiConversationsListResponse,
  AiConversationsResponse,
  AiMessagesListResponse,
  ChatEventPayload,
} from "@/types/chat-bot";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useCreateChatBotConversation = (projectId: string) => {
  return useMutation<
    AiConversationsResponse,
    AxiosError<ErrorResponse>,
    {
      projectId: string;
    }
  >({
    mutationKey: ["create-chat-bot-conversation", projectId],
    mutationFn: async (payload) => {
      const response = await apiClient.post<AiConversationsResponse>(
        ENDPOINTS.AI_CONVERSATIONS,
        payload,
      );
      return response.data;
    },
  });
};

export const useFetchChatBotConversations = (
  projectId: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery<AiConversationsListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["chat-bot-conversations", projectId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<AiConversationsListResponse>(
        ENDPOINTS.AI_CONVERSATIONS,
        {
          params: { projectId, page, limit },
        },
      );
      return response.data;
    },
    enabled: Boolean(projectId),
  });
};

// When user sends a chat message (request) to the chat bot
export const useCreateChatBotMessages = () => {
  return useMutation<
    AiMessagesResponse,
    AxiosError<ErrorResponse>,
    AiMessagesPayload
  >({
    mutationKey: ["create-chat-bot-messages"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<AiMessagesResponse>(
        ENDPOINTS.AI_MESSAGES,
        payload,
      );
      return response.data;
    },
  });
};

export const useFetchChatBotMessages = (
  conversationId: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery<AiMessagesListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["chat-bot-messages", conversationId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<AiMessagesListResponse>(
        ENDPOINTS.AI_MESSAGES,
        {
          params: { conversationId, page, limit },
        },
      );
      return response.data;
    },
    enabled: Boolean(conversationId),
  });
};

// Send the Model Config
export const useSendModelConfigToChatBot = (
  conversationId: string,
  page = 1,
  limit = 10,
) => {
  return useMutation<void, AxiosError<ErrorResponse>, ChatEventPayload>({
    mutationKey: ["send-model-config-to-chat-bot", conversationId],
    mutationFn: async (payload) => {
      const response = await apiClient.post<void>(
        ENDPOINTS.CHAT_BOT_CONFIG,
        payload,
        {
          params: {
            chatId: conversationId,
            page,
            limit,
          },
        },
      );

      return response.data;
    },
  });
};
