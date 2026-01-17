import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createSSE, type CreateSSEOptions } from "@/features/sse";
import ENDPOINTS from "@/routes/endpoints";

const CHAT_MESSAGES_QUERY_KEY = "chat-messages-sse";

export interface UseChatMessagesOptions<TMessage> {
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
  options: UseChatMessagesOptions<TMessage> = {}
): UseChatMessagesResult<TMessage> => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<unknown>(null);

  const enabled = Boolean(chatId) && (options.enabled ?? true);

  const queryKey = useMemo(
    () => [CHAT_MESSAGES_QUERY_KEY, chatId ?? ""] as const,
    [chatId]
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
      endpoint: ENDPOINTS.CHAT_MESSAGES_STREAM,
      params: { chatId: resolvedChatId },
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
