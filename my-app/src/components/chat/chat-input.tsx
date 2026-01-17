import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useSendChatMessage } from "@/hooks/chat-messages-hooks";

const chatInputSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
});

type ChatInputFormData = z.infer<typeof chatInputSchema>;

const ChatInput = ({ projectId }: { projectId: string }) => {
  const { mutate: sendChatMessages } = useSendChatMessage();

  const { register, handleSubmit, reset } = useForm<ChatInputFormData>({
    resolver: zodResolver(chatInputSchema),
  });

  const onSubmit = (data: ChatInputFormData) => {
    sendChatMessages({
      chatId: projectId,
      message: data.message,
    });
    reset();
  };

  return (
    <form
      className="p-4 border-t border-gray-200"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        type="text"
        id="chat-input"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Type your message..."
        {...register("message")}
      />
    </form>
  );
};

export default ChatInput;
