import { useEffect, useRef } from "react";

// Calls `callback` with the latest `value` after `delay` ms of no changes.
export function useDebouncedEffect(value, callback, delay = 400) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handle = setTimeout(() => callbackRef.current(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
}
