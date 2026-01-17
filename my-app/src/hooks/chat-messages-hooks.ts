import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type {
  ChatMessagesPayload,
  ChatMessagesResponse,
} from "@/types/chat-messages";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useFetchChatMessages = (chatId: string) => {
  return useQuery<ChatMessagesResponse, AxiosError<ErrorResponse>>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const response = await apiClient.get<ChatMessagesResponse>(
        ENDPOINTS.CHAT_MESSAGES,
        {
          params: { chatId },
        }
      );
      return response.data;
    },
    enabled: Boolean(chatId),
  });
};

export const useSendChatMessage = () => {
  return useMutation<
    ChatMessagesResponse,
    AxiosError<ErrorResponse>,
    ChatMessagesPayload
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ChatMessagesResponse>(
        ENDPOINTS.CHAT_MESSAGES,
        payload
      );
      return response.data;
    },
  });
};
