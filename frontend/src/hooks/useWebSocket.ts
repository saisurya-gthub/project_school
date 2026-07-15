import { useEffect, useRef, useCallback, useState } from "react";

interface WebSocketMessage {
  type: string;
  payload: unknown;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  send: (data: WebSocketMessage) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnect = true,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions): UseWebSocketReturn {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const shouldReconnect = useRef(reconnect);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    // Add auth token to URL
    const token = localStorage.getItem("token");
    const wsUrl = token ? `${url}?token=${token}` : url;

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        onOpen?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          onMessage?.(data);
        } catch {
          console.error("Failed to parse WebSocket message");
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        onClose?.();

        // Attempt to reconnect
        if (shouldReconnect.current && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        onError?.(error);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    clearReconnectTimeout();
    ws.current?.close();
  }, [clearReconnectTimeout]);

  const send = useCallback((data: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected");
    }
  }, []);

  const reconnectManually = useCallback(() => {
    shouldReconnect.current = true;
    reconnectAttempts.current = 0;
    clearReconnectTimeout();
    ws.current?.close();
    setTimeout(() => connect(), 100);
  }, [connect, clearReconnectTimeout]);

  useEffect(() => {
    shouldReconnect.current = reconnect;
    connect();
    
    return () => {
      shouldReconnect.current = false;
      clearReconnectTimeout();
      ws.current?.close();
    };
  }, [connect, reconnect, clearReconnectTimeout]);

  return {
    isConnected,
    send,
    disconnect,
    reconnect: reconnectManually,
  };
}

// Hook for subscribing to specific events
export function useProjectUpdates(onUpdate: (project: unknown) => void) {
  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/projects";

  return useWebSocket({
    url: wsUrl,
    onMessage: (data) => {
      if (data.type === "project_update") {
        onUpdate(data.payload);
      }
    },
  });
}

// Hook for notifications
export function useNotifications(onNotification: (notification: unknown) => void) {
  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/notifications";

  return useWebSocket({
    url: wsUrl,
    onMessage: (data) => {
      if (data.type === "notification") {
        onNotification(data.payload);
      }
    },
  });
}
