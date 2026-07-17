import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useDataStore<T>
 *
 * Fetches data on mount and re-fetches whenever the shared
 * "crystal-water-data-changed" update event fires.
 *
 * Designed to be backend-ready: just swap the fetchFn
 * to any remote API query and everything else stays the same.
 */
export function useDataStore<T>(fetchFn: () => Promise<T>): {
  data: T | undefined;
  loading: boolean;
  refresh: () => void;
} {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Keep a stable ref to the latest fetchFn so the effect
  // closure never goes stale without re-registering the listener.
  const fnRef = useRef(fetchFn);
  fnRef.current = fetchFn;

  const refresh = useCallback(() => {
    setLoading(true);
    fnRef
      .current()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();

    // Re-fetch silently on every cross-component write
    const handler = () => {
      fnRef.current().then(setData).catch(console.error);
    };
    window.addEventListener("crystal-water-data-changed", handler);
    return () => window.removeEventListener("crystal-water-data-changed", handler);
  }, [refresh]);

  return { data, loading, refresh };
}
