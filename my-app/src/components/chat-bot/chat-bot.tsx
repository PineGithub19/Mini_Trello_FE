import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BotMessageSquare } from "lucide-react";
import ChatBotConversations from "./chat-bot-conversations";
import ChatBotConversationsCreate from "./chat-bot-conversations-create";
import { useChatBotStore } from "@/store/chat-bot-store";
import ChatBotMessagesInput from "./chat-bot-messages-create";
import ChatBotMessages from "./chat-bot-messages";

const ChatBotPanel = () => {
  const conversationId = useChatBotStore((state) => state.conversationId);
  const isInConversation = useChatBotStore((state) => state.isInConversation());

  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger>
              <BotMessageSquare className="size-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Chat Bot</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </SheetTrigger>
      <SheetContent className="sm:min-w-96 md:min-w-160">
        <SheetHeader>
          <SheetTitle>
            {isInConversation
              ? `Conversation: ${conversationId}`
              : "Chat with AI"}
          </SheetTitle>
          <SheetDescription>
            Ask questions and get instant answers from our AI-powered chat bot.
          </SheetDescription>
        </SheetHeader>
        {!isInConversation && <ChatBotConversations />}
        {isInConversation && <ChatBotMessages />}
        <SheetFooter className="p-0">
          {!isInConversation && <ChatBotConversationsCreate />}
          {isInConversation && <ChatBotMessagesInput />}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ChatBotPanel;
