import { useEffect, useRef, useState } from "react";

// A simple second-tick countdown/stopwatch used by the study timer.
// direction: 'down' counts from `initialSeconds` to 0, 'up' counts from 0 upward.
export function useTicker(running) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => setSeconds(0);
  return { seconds, setSeconds, reset };
}
