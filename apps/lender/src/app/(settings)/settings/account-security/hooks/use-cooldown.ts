import { useEffect, useState } from "react";

/** Whole seconds left on a countdown started with `start`, ticking once a second. */
export function useCooldown() {
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (until === 0) return;

    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= until) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [until]);

  return {
    seconds: Math.max(0, Math.ceil((until - now) / 1000)),
    start(seconds: number) {
      const current = Date.now();
      setNow(current);
      setUntil(current + seconds * 1000);
    },
    stop() {
      setUntil(0);
      setNow(0);
    },
  };
}
