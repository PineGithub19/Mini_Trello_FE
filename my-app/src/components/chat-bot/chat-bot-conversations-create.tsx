import { useCreateChatBotConversation } from "@/hooks/chat-bot-hooks";
import { Button } from "../ui/button";
import useProjectStore from "@/store/project-store";
import { useChatBotStore } from "@/store/chat-bot-store";

const ChatBotConversationsCreate = () => {
  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const setConversationId = useChatBotStore((state) => state.setConversationId);

  const { mutate: createConversation } = useCreateChatBotConversation(
    currentProjectId || "",
  );

  const handleCreateConversation = () => {
    if (!currentProjectId) return;
    createConversation(
      { projectId: currentProjectId },
      {
        onSuccess: (data) => {
          setConversationId(data.data.id);
        },
        onError: () => {
          setConversationId(null);
        },
      },
    );
  };

  return (
    <Button
      className="m-4"
      variant="default"
      onClick={handleCreateConversation}
    >
      New Conversation
    </Button>
  );
};

export default ChatBotConversationsCreate;
