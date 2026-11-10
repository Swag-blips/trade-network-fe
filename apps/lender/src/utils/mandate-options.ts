import type { MandateDraft } from "@/types/mandate";

export const TENORS = [
  "Up to 30 days",
  "30-90 days",
  "90-180 days",
  "Flexible",
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

export function formatAllocation(value: string) {
  const [whole = "", ...fraction] = value.replace(/[^0-9.]/g, "").split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fraction.length > 0
    ? `${grouped}.${fraction.join("").slice(0, 2)}`
    : grouped;
}

export function formatRate(value: string) {
  const [whole = "", ...fraction] = value.replace(/[^0-9.]/g, "").split(".");
  const rate =
    fraction.length > 0
      ? `${whole.slice(0, 3)}.${fraction.join("").slice(0, 2)}`
      : whole.slice(0, 3);

  return Number(rate) > 100 ? "100" : rate;
}

/**
 * A saved value from before these lists existed ("90 days") would otherwise
 * leave the select blank; offer it alongside the current choices instead.
 */
export function withSaved(options: string[], saved: string) {
  return saved && !options.includes(saved) ? [saved, ...options] : options;
}

export const parseAllocation = (value: string) =>
  Number(value.replace(/,/g, ""));

export const exceedsAllocation = (draft: MandateDraft) =>
  parseAllocation(draft.capitalAllocation) > 0 &&
  draft.fundingMax > parseAllocation(draft.capitalAllocation);

export function isCompleteMandate(draft: MandateDraft) {
  return (
    parseAllocation(draft.capitalAllocation) > 0 &&
    Number(draft.interestRate) > 0 &&
    draft.tenor !== "" &&
    draft.fundingMax > 0 &&
    draft.fundingMin <= draft.fundingMax &&
    !exceedsAllocation(draft) &&
    draft.sectors.length > 0
  );
}

const TENOR_CODES: Record<string, string> = {
  "Up to 30 days": "UP_TO_30_DAYS",
  "30-90 days": "DAYS_30_TO_90",
  "90-180 days": "DAYS_90_TO_180",
  Flexible: "FLEXIBLE",
};

export const toTenorCode = (label: string) => TENOR_CODES[label] ?? label;

export const fromTenorCode = (code: string) =>
  Object.keys(TENOR_CODES).find((label) => TENOR_CODES[label] === code) ??
  code;

export const toSectorCode = (label: string) =>
  label.toUpperCase().replace(/ /g, "_");

export const fromSectorCode = (code: string) =>
  SECTORS.find((label) => toSectorCode(label) === code) ??
  code.charAt(0) + code.slice(1).toLowerCase().replace(/_/g, " ");

// Naira has two decimal places; another currency would need its own multiplier.
export const toMinorUnits = (naira: number) => Math.round(naira * 100);
export const fromMinorUnits = (minor: number) => minor / 100;

export const toBps = (percent: number) => Math.round(percent * 100);
export const fromBps = (bps: number) => bps / 100;
