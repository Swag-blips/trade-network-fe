import type { Mandate } from "@/types/mandate";
import { toBps } from "@/utils/mandate-options";
import { fromMinorUnits, naira, toMinorUnits } from "@/utils/naira";
import type { OfferTerms } from "../types/inbox";

/** The API takes any whole day inside the mandate's tenor; these are the picks offered. */
const TENOR_DAYS: Record<string, { min: number; max: number; days: number[] }> =
  {
    "Up to 30 days": { min: 1, max: 30, days: [7, 14, 21, 30] },
    "30-90 days": { min: 30, max: 90, days: [30, 45, 60, 90] },
    "90-180 days": { min: 90, max: 180, days: [90, 120, 150, 180] },
    Flexible: { min: 1, max: Infinity, days: [30, 45, 60, 90, 120, 180] },
  };

/** `requested` is the request's own tenor when the mandate allows it. */
export function tenorOptions(
  mandateTenor: string | undefined,
  requested: number,
) {
  const { min, max, days } =
    TENOR_DAYS[mandateTenor ?? ""] ?? TENOR_DAYS.Flexible!;
  const fits = requested >= min && requested <= max;
  return {
    days:
      fits && !days.includes(requested)
        ? [...days, requested].sort((a, b) => a - b)
        : days,
    requested: fits ? requested : undefined,
  };
}

export const tenorLabel = (days: number) => `${days} days`;

/** The API's own rounding, in kobo, so the preview matches `interestMinor`. */
export const interestOf = ({ amount, ratePercent }: OfferTerms) =>
  fromMinorUnits(
    Math.round((toMinorUnits(amount) * toBps(ratePercent)) / 10_000),
  );

/** The amount rules `POST …/offers` enforces, short of available capital. */
export function offerAmountError(
  amount: number,
  advance: number,
  mandate: Mandate | undefined,
) {
  if (amount > advance) return "Offer no more than the requested advance";
  if (
    mandate &&
    amount > 0 &&
    (amount < mandate.fundingMin || amount > mandate.fundingMax)
  ) {
    return `Offer between ${naira(mandate.fundingMin)} and ${naira(mandate.fundingMax)}, your ticket range`;
  }
  return undefined;
}
