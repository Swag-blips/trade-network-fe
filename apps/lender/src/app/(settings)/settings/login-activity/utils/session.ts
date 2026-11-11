export type DeviceKind = "desktop" | "mobile";

export function describeDevice(userAgent: string): {
  label: string;
  kind: DeviceKind;
} {
  if (/iPhone/.test(userAgent)) return { label: "iPhone", kind: "mobile" };
  if (/iPad/.test(userAgent)) return { label: "iPad", kind: "mobile" };
  if (/Android/.test(userAgent)) {
    return { label: "Android phone", kind: "mobile" };
  }
  if (/Windows/.test(userAgent)) return { label: "Windows PC", kind: "desktop" };
  if (/Macintosh/.test(userAgent)) return { label: "Mac", kind: "desktop" };
  if (/Linux/.test(userAgent)) return { label: "Linux PC", kind: "desktop" };
  return { label: "Unknown device", kind: "desktop" };
}

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

/** "Today", "Yesterday" or "Nov 07, 2026". */
export function sessionDay(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/** "07:05 AM". */
export const sessionTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
