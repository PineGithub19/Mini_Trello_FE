import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useCreateChatBotMessages } from "@/hooks/chat-bot-hooks";
import { useChatBotStore } from "@/store/chat-bot-store";
import { ChatbotType } from "@/enums/chatbot";
import { ArrowLeft } from "lucide-react";

const chatBotMessagesInputSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
});

type ChatBotMessagesInputFormData = z.infer<typeof chatBotMessagesInputSchema>;

const ChatBotMessagesInput = () => {
  const conversationId = useChatBotStore((state) => state.conversationId);
  const clearConversation = useChatBotStore((state) => state.clear);
  const setStartStreaming = useChatBotStore((state) => state.setStartStreaming);
  const appendNewMessage = useChatBotStore((state) => state.appendNewMessage);

  const { mutate: sendChatMessages } = useCreateChatBotMessages();

  const { register, handleSubmit, reset } =
    useForm<ChatBotMessagesInputFormData>({
      resolver: zodResolver(chatBotMessagesInputSchema),
    });

  const onSubmit = (data: ChatBotMessagesInputFormData) => {
    if (!conversationId) return;

    sendChatMessages(
      {
        conversationId,
        role: ChatbotType.USER,
        content: data.message,
      },
      {
        onSuccess: (data) => {
          reset();
          setStartStreaming(true);
          appendNewMessage(data.data);
        },
        onError: () => {
          setStartStreaming(false);
        },
      },
    );
  };

  const handleBackToConversations = () => {
    clearConversation();
  };

  return (
    <form
      className="p-4 border-t border-gray-200"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center">
        <div className="ml-auto mr-4" onClick={handleBackToConversations}>
          <ArrowLeft className="size-4 p-0" />
        </div>
        <Input
          type="text"
          id="chat-input"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Type your message..."
          {...register("message")}
        />
      </div>
    </form>
  );
};

export default ChatBotMessagesInput;
