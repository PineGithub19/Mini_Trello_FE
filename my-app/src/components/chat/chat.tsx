import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MessageCircle } from "lucide-react";
import { useChatMessages } from "@/hooks/sse-hooks";
import { useFetchChatMessages } from "@/hooks/chat-messages-hooks";
import useProjectStore from "@/store/project-store";
import useAuthStore from "@/store/auth-store";
import ChatInput from "./chat-input";
import ChatSender from "./sender";
import ChatReceiver from "./receiver";
import type { ChatMessages, ChatMessagesSSE } from "@/types/chat-messages";
import { CHAT_MESSAGES_QUERY_KEY } from "@/constants/chat.constant";

const ChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const currentUserId = useAuthStore((state) => state.getUserId());
  const activeChatId = isOpen && currentProjectId ? currentProjectId : null;

  const { message: latestMessage } = useChatMessages<ChatMessagesSSE>(
    activeChatId,
    CHAT_MESSAGES_QUERY_KEY,
    {
      enabled: Boolean(activeChatId),
    }
  );
  const { data: previousMessages, isLoading } = useFetchChatMessages(
    activeChatId ?? ""
  );

  const [messages, setMessages] = useState<ChatMessages[]>([]);

  useEffect(() => {
    if (!isOpen || !previousMessages?.data) return;

    setMessages(previousMessages.data);
  }, [isOpen, previousMessages?.data]);

  useEffect(() => {
    if (!isOpen || !latestMessage?.data) return;

    setMessages((prev) => {
      if (prev.some((m) => m.id === latestMessage.data.id)) {
        return prev;
      }
      return [...prev, latestMessage.data];
    });
  }, [isOpen, latestMessage]);

  // scroll to bottom when new message arrives

  const isAtBottom = () => {
    if (!bottomRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } = bottomRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  useEffect(() => {
    if (isAtBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <SheetTrigger asChild>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger>
              <MessageCircle className="size-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Project Chat</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Project Chat</SheetTitle>
          <SheetDescription>
            Chat with your project team members in real-time.
          </SheetDescription>
        </SheetHeader>
        {isOpen && isLoading && (
          <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem] mx-auto">
            <Spinner className="mx-auto mt-10" />
          </div>
        )}
        {isOpen && !isLoading && (
          <div className="grid flex-1 auto-rows-min gap-6 px-4 py-2 max-h-fit overflow-y-auto">
            {messages.length > 0 &&
              messages.map((msg, index) => (
                <div
                  key={msg.id ?? `message-${index}`}
                  className={`flex ${
                    msg.senderId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.senderId === currentUserId ? (
                    <ChatSender
                      message={msg.message}
                      userInformation={msg.userInformation}
                    />
                  ) : (
                    <ChatReceiver
                      message={msg.message}
                      userInformation={msg.userInformation}
                    />
                  )}
                </div>
              ))}
            <div ref={bottomRef} />
          </div>
        )}
        <SheetFooter className="p-0">
          <ChatInput projectId={currentProjectId || ""} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ChatPanel;
