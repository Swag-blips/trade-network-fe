import { useEffect, useState } from "react";

/** Milliseconds until `until`, refreshed every 30 seconds and never below zero. */
export function useTimeLeft(until: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  return Math.max(0, new Date(until).getTime() - now);
}
