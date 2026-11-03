/**
 * The choices the mandate form offers, in onboarding and in settings. The
 * service stores whatever string it is sent — it has no enum for these — so
 * these lists are the only thing keeping the values consistent.
 */
export const TENORS = ["30-90 days", "90-180 days", "180-365 days"];

export const FUNDING_TYPES = [
  "Any",
  "Invoice financing",
  "Purchase order",
  "Working capital",
];

export const SECTORS = [
  "Manufacturing",
  "Agriculture",
  "Healthcare",
  "Technology",
  "Finance",
  "Energy",
  "Retail",
];

/**
 * A saved value from before these lists existed ("90 days") would otherwise
 * leave the select blank; offer it alongside the current choices instead.
 */
export function withSaved(options: string[], saved: string) {
  return saved && !options.includes(saved) ? [saved, ...options] : options;
}
