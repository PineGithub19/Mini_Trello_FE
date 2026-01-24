import { useEffect, useMemo, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import ChatReceiver from "../chat/receiver";
import ChatSender from "../chat/sender";
import {
  useFetchChatBotMessages,
  useSendModelConfigToChatBot,
} from "@/hooks/chat-bot-hooks";
import { useChatBotStore } from "@/store/chat-bot-store";
import { useChatStream } from "@/hooks/sse-hooks";
import { ChatbotType } from "@/enums/chatbot";
import type { AiMessages } from "@/types/chat-bot";

const ChatBotMessages = () => {
  const page = 1;
  const messages = useChatBotStore((state) => state.messages);
  const setMessagesInStore = useChatBotStore((state) => state.setMessages);
  const appendNewMessage = useChatBotStore((state) => state.appendNewMessage);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const previousMessageIdsRef = useRef<string[]>([]);
  const previousStreamLengthRef = useRef(0); // Keeps the last persisted assistant token count.
  const lastAppliedMessageIdRef = useRef<string | null>(null); // Prevents duplicate id updates after streaming completes.

  const conversationId = useChatBotStore((state) => state.conversationId);
  const shouldStartStreaming = useChatBotStore((state) => state.startStreaming);
  const setStartStreaming = useChatBotStore((state) => state.setStartStreaming);
  const updateMessageId = useChatBotStore((state) => state.updateMessageId);

  // Memoize streaming config so the SSE hook only reconnects when inputs change.
  const streamOptions = useMemo(
    () => ({
      page,
      limit: 10,
      onDone: () => {
        console.log("Stream done");
        setStartStreaming(false);
      },
      onError: () => {
        console.log("Stream error");
        setStartStreaming(false);
      },
    }),
    [page, setStartStreaming],
  );

  const {
    streamingText,
    streamingMessageId,
    isStreaming,
    error: streamError,
    startStreaming: openStream,
    stopStreaming,
  } = useChatStream(conversationId, streamOptions);
  const {
    data: previousMessages,
    isLoading,
    isFetching,
  } = useFetchChatBotMessages(conversationId || "", page);
  const { mutate: sendModelConfigToChatBot } = useSendModelConfigToChatBot(
    conversationId || "",
    page,
  );

  // Reset store-backed messages when the user switches conversations.
  useEffect(() => {
    setMessagesInStore([]);
    previousMessageIdsRef.current = [];
    previousStreamLengthRef.current = 0;
    lastAppliedMessageIdRef.current = null;
    stopStreaming();
    setStartStreaming(false);
  }, [conversationId, setMessagesInStore, setStartStreaming, stopStreaming]);

  // Persist the latest snapshot of conversations fetched from the server.
  useEffect(() => {
    if (!conversationId) return;

    const items = previousMessages?.data?.items ?? [];
    if (items.length > 0 && items[0]?.conversationId !== conversationId) {
      return;
    }
    setMessagesInStore(items);

    const ids = items.map((item) => item.id);
    const prevIds = previousMessageIdsRef.current;
    const hasNewMessages =
      ids.length !== prevIds.length ||
      ids[ids.length - 1] !== prevIds[prevIds.length - 1];

    if (
      hasNewMessages &&
      items.length > 0 &&
      items[items.length - 1]?.role === ChatbotType.ASSISTANT
    ) {
      stopStreaming();
      setStartStreaming(false);
    }

    previousMessageIdsRef.current = ids;
  }, [
    conversationId,
    previousMessages?.data?.items,
    setMessagesInStore,
    setStartStreaming,
    stopStreaming,
  ]);

  // Once the UI sets startStreaming=true (after sending a message), open the SSE.
  useEffect(() => {
    if (!conversationId) return;
    if (!shouldStartStreaming) return;

    void openStream();

    sendModelConfigToChatBot({
      model: "gpt-4o-mini",
      options: {
        maxTokens: 700,
        temperature: 0.7,
      },
    });

    setStartStreaming(false);
  }, [
    conversationId,
    openStream,
    setStartStreaming,
    shouldStartStreaming,
    sendModelConfigToChatBot,
  ]);

  // Merge the final assistant message emitted by the SSE into the list and refetch for parity.
  useEffect(() => {
    if (!conversationId) return;

    const nextLength = streamingText.length;
    const prevLength = previousStreamLengthRef.current;

    if (nextLength <= prevLength) return;

    const nextChunk = streamingText.slice(prevLength);
    if (!nextChunk) return;

    const streamingMessage: AiMessages = {
      id: "",
      conversationId,
      createdBy: "assistant",
      role: ChatbotType.ASSISTANT,
      content: nextChunk,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appendNewMessage(streamingMessage);
    previousStreamLengthRef.current = nextLength;
  }, [appendNewMessage, conversationId, streamingText]);

  useEffect(() => {
    if (!isStreaming) {
      previousStreamLengthRef.current = 0;
    }
  }, [isStreaming]);

  // If the response is completed, store the final message ID.
  useEffect(() => {
    if (!streamingMessageId) return;
    if (lastAppliedMessageIdRef.current === streamingMessageId) return;

    updateMessageId(streamingMessageId);
    lastAppliedMessageIdRef.current = streamingMessageId;
  }, [streamingMessageId, updateMessageId]);

  // Stop streaming if the SSE ends with an error.
  useEffect(() => {
    if (!streamError) return;

    setStartStreaming(false);
  }, [setStartStreaming, streamError]);

  // Scroll to bottom when new messages arrive.

  const isAtBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  useEffect(() => {
    if (!bottomRef.current) return;

    if (isAtBottom()) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingText]);

  const showSpinner = isLoading && messages.length === 0;

  if (!conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-6 text-sm text-muted-foreground">
        Select a conversation to view messages.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col max-h-fit overflow-y-auto">
      {showSpinner && (
        <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem] mx-auto">
          <Spinner className="mx-auto mt-10" />
        </div>
      )}
      {!showSpinner && (
        <div
          ref={scrollContainerRef}
          className="grid flex-1 auto-rows-min gap-4 px-4 py-2"
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={msg.id ?? `chatbot-message-${index}`}
                className={`flex ${
                  msg.role === ChatbotType.USER
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.role === ChatbotType.USER ? (
                  <ChatSender message={msg.content} />
                ) : (
                  <ChatReceiver message={msg.content} />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              No messages yet. Ask the AI something to get started.
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      )}
      {(isStreaming || isFetching) && !showSpinner && (
        <div className="px-4 pb-2 text-xs text-muted-foreground">
          Streaming response...
        </div>
      )}
    </div>
  );
};

export default ChatBotMessages;
