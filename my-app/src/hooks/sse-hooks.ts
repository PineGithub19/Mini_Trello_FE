import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSSE,
  type CreateSSEOptions,
  type SSEConnection,
} from "@/features/sse";
import ENDPOINTS from "@/routes/endpoints";
import type { AiMessages, ChatEvent } from "@/types/chat-bot";

export interface UseChatMessagesOptions<TMessage> {
  url?: string;
  body?: Record<string, unknown>;
  page?: number;
  limit?: number;

  enabled?: boolean;
  parser?: CreateSSEOptions<TMessage>["parser"];
  retryInterval?: number;
}

export interface UseChatMessagesResult<TMessage> {
  message: TMessage | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: unknown;
  reconnect: () => Promise<void>;
  disconnect: () => void;
}

export const useChatMessages = <TMessage = unknown>(
  chatId: string | null | undefined,
  chatQueryKey: string,
  options: UseChatMessagesOptions<TMessage> = {},
): UseChatMessagesResult<TMessage> => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<unknown>(null);

  const enabled = Boolean(chatId) && (options.enabled ?? true);

  const queryKey = useMemo(
    () => [chatQueryKey, chatId ?? ""] as const,
    [chatQueryKey, chatId],
  );

  const { data: message = null } = useQuery<TMessage | null>({
    queryKey,
    queryFn: async () => null,
    enabled,
    initialData: null,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const sseConnection = useMemo(() => {
    if (!enabled) return null;

    const resolvedChatId = chatId as string;

    return createSSE<TMessage>({
      endpoint: options.url ?? ENDPOINTS.CHAT_MESSAGES_STREAM,
      params: {
        chatId: resolvedChatId,
        page: options.page,
        limit: options.limit,
      },
      body: options.body,
      retryInterval: options.retryInterval ?? 5000,
      parser: options.parser,
      onConnectStart: () => {
        console.log("Connecting to chat messages SSE...");

        setConnectionError(null);
        setIsConnected(false);
        setIsConnecting(true);
      },
      onOpen: () => {
        console.log("Connected to chat messages SSE.");

        setIsConnected(true);
        setIsConnecting(false);
      },
      onClose: () => {
        console.log("Disconnected from chat messages SSE.");

        setIsConnected(false);
        setIsConnecting(false);
      },
      onError: (error) => {
        console.error("Error in chat messages SSE:", error);

        setConnectionError(error);
        setIsConnecting(false);
      },
      onMessage: (incoming) => {
        console.log("Received chat message via SSE:", incoming);

        if (incoming === null || incoming === undefined) return;

        queryClient.setQueryData<TMessage | null>(queryKey, () => incoming);
      },
    });
  }, [
    chatId,
    enabled,
    options.parser,
    options.retryInterval,
    options.url,
    options.body,
    options.page,
    options.limit,
    queryClient,
    queryKey,
  ]);

  useEffect(() => {
    if (!sseConnection) return;

    let cancelled = false;

    queryClient.setQueryData<TMessage | null>(queryKey, (prev) => prev ?? null);

    sseConnection.connect().catch((error) => {
      if (cancelled) return;
      setConnectionError(error);
      setIsConnecting(false);
    });

    return () => {
      cancelled = true;
      sseConnection.disconnect();
    };
  }, [queryClient, queryKey, sseConnection]);

  const reconnect = async () => {
    if (!sseConnection) return;

    try {
      await sseConnection.connect();
    } catch (error) {
      setConnectionError(error);
      throw error;
    }
  };

  const disconnect = () => {
    sseConnection?.disconnect();
  };

  return {
    message,
    isConnected,
    isConnecting,
    error: connectionError,
    reconnect,
    disconnect,
  };
};

export interface UseChatStreamOptions {
  url?: string;
  page?: number;
  limit?: number;
  retryInterval?: number;
  onToken?: (token: string) => void;
  onMessage?: (message: AiMessages) => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
}

export interface UseChatStreamResult {
  streamingText: string;
  streamingMessageId: string | null;
  isStreaming: boolean;
  error: unknown;
  startStreaming: () => Promise<void>;
  stopStreaming: () => void;
}

export const useChatStream = (
  chatId: string | null,
  options: UseChatStreamOptions = {},
): UseChatStreamResult => {
  const [streamingText, setStreamingText] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<unknown>(null);
  const connectionRef = useRef<SSEConnection | null>(null);

  const {
    url,
    page: pageParam,
    limit,
    retryInterval = 5000,
    onToken,
    onDone,
    onError,
  } = options;

  const stopStreaming = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.disconnect();
      connectionRef.current = null;
      console.log("Streaming stopped successfully.");
    }

    setIsStreaming(false);
    setStreamingText("");
  }, []);

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  const startStreaming = useCallback(async () => {
    if (!chatId) return;

    stopStreaming();
    setStreamingText("");
    setStreamingMessageId(null);
    setStreamError(null);
    setIsStreaming(true);

    const connection = createSSE<ChatEvent>({
      endpoint: url ?? ENDPOINTS.CHAT_BOT_STREAM,
      params: {
        chatId,
        page: pageParam,
        limit,
      },
      retryInterval,
      parser: (message) => {
        if (!message.data) return null;

        try {
          return JSON.parse(message.data) as ChatEvent;
        } catch (error) {
          console.error("Failed to parse SSE message:", error);
          return null;
        }
      },
      onConnectStart: () => {
        setIsStreaming(true);
      },
      onOpen: () => {
        setIsStreaming(true);
      },
      onClose: () => {
        setIsStreaming(false);
      },
      onError: (error) => {
        setStreamError(error);
        onError?.(error);
        stopStreaming();
      },
      onMessage: (incoming) => {
        if (!incoming) return;

        switch (incoming.type) {
          case "token": {
            setStreamingText((prev) => prev + incoming.value);
            onToken?.(incoming.value);
            break;
          }
          case "done": {
            setStreamingMessageId(incoming.value);
            setIsStreaming(false);
            onDone?.();
            stopStreaming();
            break;
          }
          default:
            break;
        }
      },
    });

    connectionRef.current = connection;

    try {
      await connection.connect();
    } catch (error) {
      setStreamError(error);
      onError?.(error);
      stopStreaming();
    }
  }, [
    chatId,
    limit,
    onDone,
    onError,
    onToken,
    pageParam,
    retryInterval,
    url,
    stopStreaming,
  ]);

  return {
    streamingText,
    streamingMessageId,
    isStreaming,
    error: streamError,
    startStreaming,
    stopStreaming,
  };
};
