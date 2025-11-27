import { useEffect, useState } from "react";

function resolveInitial<T>(value: T | (() => T)): T {
  return typeof value === "function" ? (value as () => T)() : value;
}

function usePersistentState<T>(key: string, initialState: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch {
      // ignore read errors
    }
    return resolveInitial(initialState);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write errors (storage full or disabled)
    }
  }, [key, state]);

  return [state, setState] as const;
}

export default usePersistentState;
