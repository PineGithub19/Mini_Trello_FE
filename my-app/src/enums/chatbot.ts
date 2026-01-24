export const ChatbotType = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export type ChatbotType = (typeof ChatbotType)[keyof typeof ChatbotType];
