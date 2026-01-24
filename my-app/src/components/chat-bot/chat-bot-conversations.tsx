import { useFetchChatBotConversations } from "@/hooks/chat-bot-hooks";
import { useChatBotStore } from "@/store/chat-bot-store";
import useProjectStore from "@/store/project-store";
import { useState } from "react";

const ChatBotConversations = () => {
  const [page, setPage] = useState(1);

  const setConversationId = useChatBotStore((state) => state.setConversationId);

  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const { data: conversations } = useFetchChatBotConversations(
    currentProjectId || "",
    page
  );

  return (
    <div className="grid flex-1 auto-rows-min gap-6 px-4 py-2 max-h-fit overflow-y-auto">
      <h2 className="font-semibold mb-4">Conversations</h2>
      <ul>
        {conversations?.data.items.map((conversation) => (
          <li
            key={conversation.id}
            className="mb-2 p-2 border rounded"
            onClick={() => setConversationId(conversation.id)}
          >
            <p className="font-medium">Conversation ID: {conversation.id}</p>
            <p className="text-sm text-muted-foreground">
              Created At: {new Date(conversation.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatBotConversations;
