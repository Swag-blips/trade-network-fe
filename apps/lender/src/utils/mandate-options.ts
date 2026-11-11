import type { Mandate, MandateDraft, MandateTerms } from "@/types/mandate";
import { formatAmountInput, parseAmountInput } from "@/utils/naira";

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

export const exceedsAllocation = (draft: MandateDraft) =>
  parseAmountInput(draft.capitalAllocation) > 0 &&
  draft.fundingMax > parseAmountInput(draft.capitalAllocation);

export function isCompleteMandate(draft: MandateDraft) {
  return (
    parseAmountInput(draft.capitalAllocation) > 0 &&
    Number(draft.interestRate) > 0 &&
    draft.tenor !== "" &&
    draft.fundingMax > 0 &&
    draft.fundingMin <= draft.fundingMax &&
    !exceedsAllocation(draft) &&
    draft.sectors.length > 0
  );
}

export const toDraft = (mandate: Mandate): MandateDraft => ({
  capitalAllocation: formatAmountInput(String(mandate.capitalAllocation)),
  interestRate: String(mandate.interestRate),
  tenor: mandate.tenor,
  fundingMin: mandate.fundingMin,
  fundingMax: mandate.fundingMax,
  sectors: mandate.businessSectors,
});

export const fromDraft = (draft: MandateDraft): MandateTerms => ({
  capitalAllocation: parseAmountInput(draft.capitalAllocation),
  interestRate: Number(draft.interestRate),
  tenor: draft.tenor,
  fundingMin: draft.fundingMin,
  fundingMax: draft.fundingMax,
  businessSectors: draft.sectors,
});

/** Whether saving would change anything; sector order doesn't count. */
export function isSameDraft(a: MandateDraft, b: MandateDraft) {
  return (
    parseAmountInput(a.capitalAllocation) ===
      parseAmountInput(b.capitalAllocation) &&
    Number(a.interestRate) === Number(b.interestRate) &&
    a.tenor === b.tenor &&
    a.fundingMin === b.fundingMin &&
    a.fundingMax === b.fundingMax &&
    a.sectors.length === b.sectors.length &&
    a.sectors.every((sector) => b.sectors.includes(sector))
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
  Object.keys(TENOR_CODES).find((label) => TENOR_CODES[label] === code) ?? code;

export const toSectorCode = (label: string) =>
  label.toUpperCase().replace(/ /g, "_");

export const fromSectorCode = (code: string) =>
  SECTORS.find((label) => toSectorCode(label) === code) ??
  code.charAt(0) + code.slice(1).toLowerCase().replace(/_/g, " ");

export const toBps = (percent: number) => Math.round(percent * 100);
export const fromBps = (bps: number) => bps / 100;
