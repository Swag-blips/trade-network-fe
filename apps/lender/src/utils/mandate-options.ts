/** The choices the mandate form offers, in onboarding and in settings. */
export const TENORS = ["30-90 days", "90-180 days", "180-365 days"];

export const ONBOARDING_TENORS = [
  "Up to 30 days",
  "30-90 days",
  "90-180 days",
  "Flexible",
];

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

// `parseAmount` keeps only digits, so a decimal from the service (e.g.
// 2000000.00) would otherwise have its "." read as another digit. Round here.
export const formatAmount = (value: number) =>
  Math.round(value).toLocaleString("en-NG");

export const parseAmount = (value: string) =>
  Number(value.replace(/[^0-9]/g, ""));

/**
 * A saved value from before these lists existed ("90 days") would otherwise
 * leave the select blank; offer it alongside the current choices instead.
 */
export function withSaved(options: string[], saved: string) {
  return saved && !options.includes(saved) ? [saved, ...options] : options;
}
