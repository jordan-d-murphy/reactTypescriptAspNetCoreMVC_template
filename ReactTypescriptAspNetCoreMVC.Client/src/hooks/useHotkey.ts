// hooks/useHotkey.ts
import { useEffect } from "react";

export function useHotkey(keys: string[], callback: () => void) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (
        keys.includes(key) &&
        (e.metaKey || e.ctrlKey) // add support for Shift/Alt if needed
      ) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [keys, callback]);
}
