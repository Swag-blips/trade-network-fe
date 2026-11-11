import type { LoginSession } from "./types/session";

// Mock data: the service keeps sessions but has no endpoint for them yet.
function at(daysAgo: number, hours: number, minutes: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function getLoginSessions(): LoginSession[] {
  return [
    {
      id: "session-1",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      ipAddress: "10.0.0.5",
      createdAt: at(0, 7, 5),
    },
    {
      id: "session-2",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 19_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.1 Mobile/15E148 Safari/604.1",
      ipAddress: "102.89.34.17",
      createdAt: at(1, 18, 42),
    },
    {
      id: "session-3",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.1 Safari/605.1.15",
      ipAddress: "41.58.112.6",
      createdAt: at(4, 9, 30),
    },
  ];
}
