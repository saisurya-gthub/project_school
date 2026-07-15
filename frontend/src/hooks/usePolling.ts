import { useEffect, useRef, useCallback, useState } from "react";

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UsePollingReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
}

/**
 * Hook for polling data at regular intervals
 * 
 * @example
 * ```tsx
 * const { data, loading, startPolling, stopPolling } = usePolling({
 *   fetcher: () => projectService.getProjects(),
 *   interval: 30000, // 30 seconds
 *   enabled: true,
 *   onSuccess: (data) => console.log('Updated:', data),
 * });
 * ```
 */
export function usePolling<T>({
  fetcher,
  interval = 30000,
  enabled = true,
  onSuccess,
  onError,
}: UsePollingOptions<T>): UsePollingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(enabled);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetcher();
      if (isMounted.current) {
        setData(result);
        setError(null);
        onSuccess?.(result);
      }
    } catch (err) {
      if (isMounted.current) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        onError?.(error);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetcher, onSuccess, onError]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    // Initial fetch
    fetchData();

    // Set up polling
    if (isPolling && interval > 0) {
      intervalRef.current = setInterval(fetchData, interval);
    }

    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, interval, isPolling]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    startPolling,
    stopPolling,
    isPolling,
  };
}

/**
 * Hook for polling with automatic refresh on window focus
 */
export function usePollingWithFocus<T>(options: UsePollingOptions<T>): UsePollingReturn<T> {
  const result = usePolling(options);

  useEffect(() => {
    const handleFocus = () => {
      result.refetch();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [result.refetch]);

  return result;
}
