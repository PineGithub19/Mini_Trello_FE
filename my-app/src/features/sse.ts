import {
  fetchEventSource,
  type EventSourceMessage,
  type FetchEventSourceInit,
} from "@microsoft/fetch-event-source";
import apiClient from "@/query/api-client";
import useAuthStore from "@/store/auth-store";

type QueryValue = string | number | boolean | null | undefined;

export interface CreateSSEOptions<TData> {
  endpoint: string;
  baseUrl?: string;
  params?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string | Record<string, unknown> | FormData | URLSearchParams;
  retryInterval?: number;
  credentials?: RequestCredentials;
  openWhenHidden?: boolean;
  parser?: (message: EventSourceMessage) => TData | null | undefined;
  onMessage: (data: TData, raw: EventSourceMessage) => void;
  onError?: (error: unknown) => void;
  onOpen?: (response: Response) => void;
  onClose?: () => void;
  tokenProvider?: () => string | null | Promise<string | null>;
  onConnectStart?: () => void;
}

export interface SSEConnection {
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: () => boolean;
}

const defaultParser = <TData>(message: EventSourceMessage): TData | null => {
  if (!message.data) return null;

  try {
    return JSON.parse(message.data) as TData;
  } catch {
    return message.data as unknown as TData;
  }
};

const resolveBaseUrl = (baseUrl?: string) => {
  if (baseUrl) return ensureTrailingSlash(baseUrl);

  const clientBase = apiClient.defaults.baseURL;
  if (clientBase) return ensureTrailingSlash(clientBase);

  return ensureTrailingSlash(window.location.origin);
};

const ensureTrailingSlash = (value: string) =>
  value.endsWith("/") ? value : `${value}/`;

const buildUrl = (
  endpoint: string,
  baseUrl: string,
  params?: Record<string, QueryValue>,
) => {
  const url = endpoint.startsWith("http")
    ? new URL(endpoint)
    : new URL(endpoint.replace(/^\//, ""), baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

const resolveToken = async (
  provider?: CreateSSEOptions<unknown>["tokenProvider"],
) => {
  if (provider) {
    const token = await provider();
    return token ?? null;
  }

  return useAuthStore.getState().token;
};

const serializeBody = (
  body: CreateSSEOptions<unknown>["body"],
  method?: string,
): { payload: BodyInit | undefined; contentType?: string } => {
  if (!body || method === "GET") {
    return { payload: undefined };
  }

  if (typeof body === "string") {
    return { payload: body };
  }

  if (body instanceof FormData || body instanceof URLSearchParams) {
    return { payload: body };
  }

  return {
    payload: JSON.stringify(body),
    contentType: "application/json",
  };
};

export const createSSE = <TData>(
  options: CreateSSEOptions<TData>,
): SSEConnection => {
  let controller: AbortController | null = null;
  let active = false;
  let currentClose: (() => void) | null = null;

  const connect = async () => {
    if (active) return;

    controller = new AbortController();
    const { signal } = controller;

    const baseUrl = resolveBaseUrl(options.baseUrl);
    const url = buildUrl(options.endpoint, baseUrl, options.params);
    const parser = options.parser ?? defaultParser<TData>;
    const method = options.method ?? "GET";
    const { payload, contentType } = serializeBody(options.body, method);

    const handleClose = () => {
      if (!currentClose) return;
      const closeCallback = currentClose;
      currentClose = null;
      closeCallback();
    };

    currentClose = () => {
      options.onClose?.();
    };

    try {
      active = true;

      const token = await resolveToken(options.tokenProvider);

      const headers: Record<string, string> = {
        Accept: "text/event-stream",
        ...(options.headers ?? {}),
      };

      if (contentType && !headers["Content-Type"]) {
        headers["Content-Type"] = contentType;
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const fetchOptions: FetchEventSourceInit & { retry?: number } = {
        method,
        body: payload,
        headers,
        signal,
        credentials: options.credentials,
        openWhenHidden: options.openWhenHidden,
        onopen: async (response) => {
          if (response.ok) {
            if (options.onConnectStart) {
              Promise.resolve().then(() => {
                if (controller?.signal.aborted) return;
                options.onConnectStart?.();
              });
            }
            options.onOpen?.(response);
            return;
          }

          if (response.status === 401) {
            useAuthStore.getState().logout();
          }

          throw new Error(
            `SSE connection failed with status ${response.status}`,
          );
        },
        onmessage: (message) => {
          const data = parser(message);

          if (data !== null && data !== undefined) {
            options.onMessage(data, message);
          }
        },
        onclose: () => {
          handleClose();
        },
        onerror: (error) => {
          if (signal.aborted) return;
          options.onError?.(error);
          return options.retryInterval;
        },
      };

      if (options.retryInterval !== undefined) {
        fetchOptions.retry = options.retryInterval;
      }

      await fetchEventSource(url, fetchOptions);

      handleClose();
    } catch (error) {
      if (!controller?.signal.aborted) {
        options.onError?.(error);
      }
      handleClose();
      throw error;
    } finally {
      active = false;
      controller = null;
    }
  };

  const disconnect = () => {
    if (controller && !controller.signal.aborted) {
      controller.abort();
      currentClose?.();
      currentClose = null;
      console.log("SSE disconnected successfully");
    }
  };

  const isConnected = () => active;

  return {
    connect,
    disconnect,
    isConnected,
  };
};
