import type { AiMessages } from "@/types/chat-bot";
import { create } from "zustand";

interface ChatBotStates {
  conversationId: string | null;
  startStreaming: boolean;
  messages: AiMessages[];
}

interface ChatBotActions {
  setConversationId: (conversationId: string | null) => void;
  isInConversation: () => boolean;
  setStartStreaming: (startStreaming: boolean) => void;
  setMessages: (messages: AiMessages[]) => void;
  appendNewMessage: (message: AiMessages) => void;
  updateMessageId: (messageId: string) => void;
  clear: () => void;
}

type ChatBotStore = ChatBotStates & ChatBotActions;

export const useChatBotStore = create<ChatBotStore>((set, get) => ({
  conversationId: null,
  startStreaming: false,
  messages: [],
  setConversationId: (conversationId: string | null) =>
    set(() => ({ conversationId })),
  isInConversation: () => {
    const { conversationId } = get();
    return conversationId !== null;
  },
  setStartStreaming: (startStreaming: boolean) =>
    set(() => ({ startStreaming })),
  setMessages: (messages: AiMessages[]) => set(() => ({ messages })),
  appendNewMessage: (message: AiMessages) =>
    set((state) => {
      const existingMessage = state.messages.find(
        (m) => m.id === message.id,
      ) as AiMessages;

      if (!existingMessage) {
        return { messages: [...state.messages, message] };
      }

      const updatedMessage = {
        ...existingMessage,
        content: existingMessage.content + message.content,
      };
      const updatedMessages = state.messages.map((m) =>
        m.id === message.id ? updatedMessage : m,
      );
      return { messages: updatedMessages };
    }),
  updateMessageId: (messageId: string) =>
    set((state) => {
      const message = state.messages.find((m) => m.id === "");
      if (!message) return {};

      const updatedMessage = { ...message, id: messageId };
      const updatedMessages = state.messages.map((m) =>
        m.id === "" ? updatedMessage : m,
      );
      return { messages: updatedMessages };
    }),
  clear: () =>
    set(() => ({
      conversationId: null,
      startStreaming: false,
      messages: [],
    })),
}));
