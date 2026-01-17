import { ApiResponse } from "./response";

export type ChatMessagesPayload = {
  chatId: string;
  message: string;
};

export type ChatMessages = {
  id: string;
  chatId: string;
  senderId: string;
  userInformation?: {
    name: string;
    email: string;
    avatar: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessagesResponse = ApiResponse<ChatMessages[]>;
export type ChatMessagesSSE = ApiResponse<ChatMessages>;
