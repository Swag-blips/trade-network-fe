/** "Dec 05, 2026", in the viewer's timezone. */
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

/** "December 05, 2026". */
export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

/** "24 November 2026" (or "24 Nov 2026" with `short`), in the viewer's locale's order. */
export const localeDate = (iso: string, month: "long" | "short" = "long") =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month,
    year: "numeric",
  });

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from now until `iso`, rounded up and never below 1. */
export const daysUntil = (iso: string) =>
  Math.max(1, Math.ceil((new Date(iso).getTime() - Date.now()) / DAY_MS));
