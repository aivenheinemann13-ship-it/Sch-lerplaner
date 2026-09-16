import { useEffect } from "react";

// Registers a single global keydown handler. `handler(event)` decides what to do;
// call event.preventDefault() inside when the shortcut matches.
export function useGlobalKeydown(handler, deps = []) {
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
